import { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'

const Content = (props) => {
    const [contentt, setcontentt] = useState([])
    let history = useHistory()
    // const [clickContent, setClickContent] = useState('')
    // props.callback(contentt)

    useEffect(() => {
        // fetch('http://localhost:3001/data')
        //     .then(res => res.json())
        //     .then(response => {
        //         // let result = response.filter(res => {
        //         //     return res.email == props.dataFromEmail
        //         // })
        //         console.log(response)
        //         setcontentt(response)
        //     })
        //     .catch(err => console.log(err))
        if (window.screen.width < 992) {
            history.push("/notresponsive")
        }
        else {
            history.push("/")
            fetch('http://localhost:3100/data')
                .then(res => res.json())
                .then(response => {
                    setcontentt(response)
                    console.log(response)
                })
                .catch(err => console.log(err))
        }
    }, [])

    const certainContent = (res) => {
        props.getdata(res)
    }

    return (
        <div className="cardcon">
            {contentt.map((res) => (
                <div className="card" key={res.title}>
                    <div><Link className="title" to={`/article/${res.title}`} onClick={() => certainContent(res)}>{res.title}</Link></div>
                    <div className="date">{res.date}</div>
                    <div className="body">{res.body}</div>
                </div>
            ))}
        </div>
    );
}

export default Content;