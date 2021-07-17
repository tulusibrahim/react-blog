import { useEffect, useState } from "react"
import axios from 'axios'
import { Link } from "react-router-dom"

const Admin = (props) => {

    const [data, setData] = useState('')
    const [warn, setWarn] = useState('')

    const deletePost = (id) => {
        let ask = window.confirm('Are you sure?');
        if (ask == true) {
            axios.post(`http://localhost:3100/${id}/deletepost`)
        }
        else {
            return
        }
    }

    useEffect(() => {
        if (localStorage.getItem('email') == null) {
            setWarn("Youre not login yet")
        } else {
            fetch('http://localhost:3100/data')
                .then(res => res.json())
                .then(response => {
                    console.log(response)
                    let result = response.filter(res => {
                        // console.log(res.email)
                        // console.log(props.dataFromEmail)
                        return res.email == localStorage.getItem('email')
                    })
                    console.log(result)
                    setData(result)
                    console.log(data)
                })
                .catch(err => console.log(err))
        }
    }, [])

    let style = { fontSize: '2rem', fontWeight: '500' }

    return (
        <div>
            <div className="admin" style={{ flexDirection: 'column', width: '100%' }}>
                <div style={{ width: '90%' }}>
                    <div className="admin" style={{ justifyContent: "flex-start" }}>Your posts</div>
                    {
                        data !== '' ?
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
                                                <i class="far fa-edit"></i>
                                            </Link>
                                        </div>
                                        <div onClick={() => deletePost(res.id)} style={{ cursor: 'pointer' }}>
                                            <i class="far fa-trash-alt"></i>
                                        </div>
                                    </div>
                                </div>
                            ))
                            :
                            <h1 style={style}>{warn}</h1>}
                </div>
            </div>
        </div>
    );
}

export default Admin;