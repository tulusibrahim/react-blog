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
            if (error) alert('Failed to delete post comment')

        } catch (error) {
            swal("Something is error. Please try again", {
                icon: "warning",
            });
        }
    }

    const getData = async () => {
        const user = supabase.auth.user()
        const { data, error } = await supabase.from('blog').select().eq('email', user.email)
        if (data == '') {
            setWarn('Your post will appear here.')
        }
        setData(data)
    }

    useEffect(() => {
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
                <div style={{ width: '90%' }}>
                    <div className="admin" style={{ justifyContent: "space-between", paddingTop: '20px' }}>
                        <div>
                            Your posts
                        </div>
                        <div>
                            {supabase.auth.session() && supabase.auth.user().email}
                        </div>
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
                                        <div className="date" style={{ fontSize: "0.6em", color: '#a1a1a1' }}>{res.date}</div>
                                        {/* <div className="body" style={{ fontSize: "1em" }}>{parseBody(res.body)}</div> */}
                                    </div>
                                    <div style={{ width: '10%', textAlign: 'center', display: 'flex', flexDirection: "row", justifyContent: 'space-evenly' }}>
                                        <div style={{ cursor: 'pointer' }}>
                                            <Link to={{ pathname: '/edit', query: { res } }} style={{ color: 'white' }} data-toggle="tooltip" title="Edit">
                                                <i className="far fa-edit"></i>
                                            </Link>
                                        </div>
                                        <div onClick={() => deletePost(res.id)} style={{ cursor: 'pointer' }} data-toggle="tooltip" title="Delete">
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