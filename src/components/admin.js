import { useEffect, useState } from "react"

const Admin = (props) => {

    const [data, setData] = useState('')
    const [warn, setWarn] = useState('')

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
            <div className="admin">Admin page</div>
            <div className="admin">
                {data !== '' ? data.map(res => (
                    <div className="" key={res.id}>
                        <div className="isi" >
                            <div className="title">{res.title}</div>
                            <div className="date">{res.date}</div>
                            <div className="body">{res.body}</div>
                        </div>
                    </div>
                )) : <h1 style={style}>{warn}</h1>}
            </div>
        </div>
    );
}

export default Admin;