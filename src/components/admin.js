import { useEffect, useState } from "react"
import { supabase } from "../configs/configurations"
import { Link } from "react-router-dom"
import swal from 'sweetalert';
const Admin = (props) => {
    const [data, setData] = useState('')
    const [warn, setWarn] = useState('')

    const deletePost = async (id) => {
        try {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to see the post anymore!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(async (willDelete) => {
                    console.log(willDelete)
                    if (willDelete) {
                        await deleteComment(id)
                        const { data, error } = await supabase
                            .from('blog')
                            .delete()
                            .match({ id: id })

                        if (error) {
                            swal("Failed delete post", {
                                icon: "warning",
                            });
                        }
                        else if (data) {
                            swal("Success delete data", {
                                icon: "success",
                            });
                        }
                        getData()
                    } else {
                        return
                    }
                });
        } catch (error) {
            swal("Something is error. Please try again", {
                icon: "warning",
            });
        }
    }

    const deleteComment = async (id) => {
        try {
            const { data, error } = await supabase
                .from('blog_comments')
                .delete()
                .match({ articleId: id })
            if (error) {
                swal("Failed to delete post comment", {
                    icon: "warning",
                });
            }

        } catch (error) {
            swal("Something is error. Please try again", {
                icon: "warning",
            });
        }
    }

    const getData = async () => {
        const user = supabase.auth.user()
        const { data, error } = await supabase
            .from('blog')
            .select(`
                        *,
                        blog_comments(
                            *
                        )
                    `)
            .eq('email', user.email)
        if (data == '') {
            setWarn('Your post will appear here.')
        }
        setData(data)
    }

    useEffect(() => {
        document.title = `Profile`
        setData('')
        setWarn('')
        if (supabase.auth.session() == null) {
            setWarn("Login in to see your post")
        } else {
            getData()
        }
    }, [])

    return (
        <div>
            <div className="admin" style={{ flexDirection: 'column', width: '100%' }}>
                <div style={{ width: '90%', paddingBottom: 20 }}>
                    <div className="admin" style={{ justifyContent: "space-between", paddingTop: '20px' }}>
                        <div>
                            Your posts
                        </div>
                        {/* <div>
                            {supabase.auth.session() && supabase.auth.user().email}
                        </div> */}
                    </div>
                    {
                        data == '' ?
                            <h1 style={{ fontSize: '2rem', fontWeight: '500' }}>{warn}</h1>
                            :
                            data.map(res => (
                                <div className="" key={res.id} style={{ paddingTop: 12, display: 'flex', paddingBottom: 12, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', borderBottom: '.1px #838383 solid' }}>
                                    <div className="isi" style={{ width: '90%' }}>
                                        <Link style={{ textDecoration: 'none', color: 'white' }} to={{ pathname: `/article/${res.title}`, query: { res } }}>
                                            <div className="title" style={{ fontSize: "1.2em", marginBottom: '3px', textDecorationLine: 'none' }}>{res.title}</div>
                                        </Link>
                                        <div className="date" style={{ fontSize: "0.6em", color: '#a1a1a1', marginBottom: 10 }}>{res.date}</div>
                                        <div style={{ display: 'flex', maxWidth: '20%', justifyContent: 'flex-start', marginTop: '5px' }}>
                                            <div style={{ display: 'flex', width: 'fit-content', marginRight: '20px', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                                <i className="far fa-eye" style={{ marginRight: '10px' }} data-toggle="tooltip" title="Views"></i>
                                                {
                                                    res.pageViews ? res.pageViews : '0'
                                                }
                                            </div>
                                            <div style={{ display: 'flex', width: 'fit-content', marginRight: '20px', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                                <i className="far fa-heart" style={{ marginRight: '10px' }} data-toggle="tooltip" title="Likes"></i>
                                                {
                                                    res.likes ? res.likes : '0'
                                                }
                                            </div>
                                            <div style={{ display: 'flex', width: 'fit-content', marginRight: '20px', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                                <i className="far fa-comment-dots" style={{ marginRight: '10px' }} data-toggle="tooltip" title="Comments"></i>
                                                {
                                                    res.blog_comments.length ? res.blog_comments.length : '0'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ width: '10%', textAlign: 'center', display: 'flex', flexDirection: "row", justifyContent: 'space-evenly' }}>
                                        <div style={{ cursor: 'pointer' }}>
                                            <Link to={{ pathname: '/edit', query: { res } }} style={{ color: 'white' }} data-toggle="tooltip" title="Edit">
                                                <i className="far fa-edit"></i>
                                            </Link>
                                        </div>
                                        <div onClick={() => deletePost(res.id)} style={{ cursor: 'pointer', color: '#dc3545' }} data-toggle="tooltip" title="Delete">
                                            <i className="far fa-trash-alt"></i>
                                        </div>
                                    </div>
                                </div>
                            ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Admin;