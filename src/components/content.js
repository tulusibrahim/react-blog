import { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import ShowMoreText from 'react-show-more-text';

const Content = (props) => {
    const [contentt, setcontentt] = useState([])
    let history = useHistory()
    // const [clickContent, setClickContent] = useState('')
    // props.callback(contentt)

    useEffect(() => {
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
        // axios.post('http://localhost:3100/deleteksong')
        //     .then(res => console.log(res))
    }, [])

    const certainContent = (res) => {
        props.getdata(res)
    }

    return (
        <div className="cardcon">
            {
                contentt ?
                    contentt.map((res) => (
                        <div className="card" key={res.id}>
                            <Link className="title" to={{ pathname: `/article/${res.title}`, query: { res } }}>
                                <div>{res.title}</div>
                            </Link>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div className="date">{res.email}, &nbsp;</div>
                                <div className="date">{res.date}</div>
                            </div>
                            <div className="body">
                                <ShowMoreText
                                    /* Default options */
                                    lines={6}
                                    more='Show more'
                                    less='Show less'
                                    anchorClass='readMore'
                                    onClick={(res) => console.log(res)}
                                    expanded={false}
                                >
                                    {res.body}
                                </ShowMoreText>
                            </div>
                        </div>
                    ))
                    :
                    <div>No blogs :(</div>
            }
        </div>
    );
}

export default Content;