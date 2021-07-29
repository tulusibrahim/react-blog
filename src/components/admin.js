import { useEffect, useState } from "react"
import axios from 'axios'
import { supabase } from "../configs/configurations"
import { Link } from "react-router-dom"

const Admin = (props) => {

    const [data, setData] = useState('')
    const [warn, setWarn] = useState('')

    const deletePost = async (id) => {
        let ask = window.confirm('Are you sure?');
        if (ask == true) {
            const { data, error } = await supabase
                .from('blog')
                .delete()
                .match({ id: id })

            const { data, errorr } = await supabase
                .from('blog_comments')
                .delete()
                .match({ articleId: id })

            if (error) {
                alert('Failed to delete post')
            }
            getData()
        }
        else {
            return
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
            setWarn("Youre not login yet")
        } else {
            getData()
        }
    }, [])

    return (
        <div>
            <div className="admin" style={{ flexDirection: 'column', width: '100%' }}>
                <div style={{ width: '90%' }}>
                    <div className="admin" style={{ justifyContent: "flex-start" }}>Your posts</div>
                    {
                        data == '' ?
                            <h1 style={{ fontSize: '2rem', fontWeight: '500' }}>{warn}</h1>
                            :
                            data.map(res => (
                                <div className="" key={res.id} style={{ marginTop: 10, display: 'flex', paddingBottom: 10, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', borderBottom: '.1px #838383 solid' }}>
                                    <div className="isi" style={{ width: '90%' }}>
                                        <div className="title" style={{ fontSize: 28 }}>{res.title}</div>
                                        <div className="date" style={{ fontSize: 12, color: '#a1a1a1' }}>{res.date}</div>
                                        <div className="body">{res.body}</div>
                                    </div>
                                    <div style={{ width: '10%', textAlign: 'center', display: 'flex', flexDirection: "row", justifyContent: 'space-evenly' }}>
                                        <div style={{ cursor: 'pointer' }}>
                                            <Link to={{ pathname: '/edit', query: { res } }} style={{ color: 'white' }}>
                                                <i className="far fa-edit"></i>
                                            </Link>
                                        </div>
                                        <div onClick={() => deletePost(res.id)} style={{ cursor: 'pointer' }}>
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