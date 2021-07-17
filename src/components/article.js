import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios'

const Article = (props) => {

    const { title } = useParams()
    const [content, setContent] = useState('')
    const [comments, setComments] = useState([])
    const [inputComment, setInputComments] = useState('')

    useEffect(() => {
        fetch('http://localhost:3100/article?title=' + title)
            .then((res) => res.json())
            .then((response) => {
                response.map(ress => {
                    if (ress.title == title) {
                        setComments(oldvalue => [...oldvalue, ress])
                    }
                })
            })


        if (!props.data) {
            fetch('http://localhost:3100/data')
                .then(res => res.json())
                .then(response => {
                    response.filter(res => {
                        if (res.title == title) {
                            setContent(res)
                            // console.log(content)
                            // console.log(res)
                        }
                    })
                })
        }
    }, [])

    // const submitComment = (e) => {
    //     e.preventDefault()
    //     const data = new FormData(e.target)
    //     let dataa = {
    //         email: localStorage.getItem('email'),
    //         komen: inputComment
    //     }
    //     console.log(data.getAll('email', 'komen'))
    //     if (localStorage.getItem('email') == null) {
    //         alert("login dulu atuh")
    //     }
    //     else {
    //         fetch('http://localhost:3100/newcomment', { method: "POST", body: dataa })
    //             .then((res) => console.log(res))
    //             .catch(err => console.log(err))
    //     }


    // }

    return (
        props.data == '' ?
            <div className="articlecon">
                <div className="isi">
                    <div className="title">{content.title}</div>
                    <div className="date">{content.email}, {content.date}</div>
                    <div className="body">{content.body}</div>
                </div>
                <div className="commentscon">
                    <h2>Comments</h2>
                    {
                        comments == '' ?
                            <div className="commentsection">
                                <div>There is no comment here.</div>
                            </div>
                            :
                            <div className="commentsection">
                                {comments.map(komentar => (
                                    <div key={komentar.id} className="comment">
                                        <div>{komentar.from_who}</div>
                                        <div>{komentar.comment}</div>
                                    </div>
                                ))}
                            </div>
                    }
                    <div className="addcomment">
                        {
                            localStorage.getItem('email') == null ? 'You need to login first to comment' :
                                <>
                                    <div>Add comment</div>
                                    <form action="http://localhost:3100/newcomment" method="POST">
                                        <input name="comment" placeholder=" Your comment..." onChange={(e) => setInputComments(e.target.value)}></input>
                                        <input name="fromwho" defaultValue={localStorage.getItem('email')} style={{ display: 'none' }}></input>
                                        <input name="route" style={{ display: "none" }} defaultValue={title}></input>
                                        <input name="author" style={{ display: "none" }} defaultValue={content.email}></input>
                                        <button>Comment</button>
                                    </form>
                                </>
                        }
                    </div>
                </div>
            </div>
            :
            <div className="articlecon">
                <div className="isi">
                    <div className="title">{props.data.title}</div>
                    <div className="date">{props.data.email}{props.data.date}</div>
                    <div className="body">{props.data.body}</div>
                </div>
                <div className="commentscon">
                    <h2>Comments</h2>
                    {
                        comments == '' ?
                            <div className="commentsection">
                                <div>There is no comment here.</div>
                            </div>
                            :
                            <div className="commentsection">
                                {comments.map(komentar => (
                                    <div key={komentar.id} className="comment">
                                        <div>{komentar.from_who}</div>
                                        <div>{komentar.comment}</div>
                                    </div>
                                ))}
                            </div>
                    }
                    <div className="addcomment">
                        {
                            localStorage.getItem('email') == null ? 'You need to login first to comment' :
                                <>
                                    <div>Add comment</div>
                                    <form action="http://localhost:3100/newcomment" method="POST">
                                        <input name="comment" placeholder=" Your comment..." onChange={(e) => setInputComments(e.target.value)}></input>
                                        <input name="fromwho" defaultValue={localStorage.getItem('email')} style={{ display: 'none' }}></input>
                                        <input name="route" style={{ display: "none" }} defaultValue={title}></input>
                                        <input name="author" style={{ display: "none" }} defaultValue={content.email}></input>
                                        <button>Comment</button>
                                    </form>
                                </>
                        }
                    </div>
                </div>
            </div>

    );
}

export default Article;