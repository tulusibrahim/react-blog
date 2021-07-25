import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase, uuidv4 } from "../configs/configurations";

const Article = (props) => {
    const { title } = useParams()
    const [data, setData] = useState([])
    const [content, setContent] = useState('')
    const [comments, setComments] = useState([])
    const [inputComment, setInputComments] = useState('')

    const getData = async () => {
        const { data, error } = await supabase
            .from('blog')
            .select()
            .eq('title', title)
        console.log(data)
        setData(data)
        setComments(data[0].comments)
    }

    const postComment = async (e) => {
        e.preventDefault()
        const { data, error } = await supabase
            .from('blog')
            .insert([
                {
                    comments: [{
                        "author": localStorage.getItem('email'),
                        "comment": inputComment,
                        "time": "28 july 2021"
                    }]
                }
            ])
            .filter('title', 'eq', title)
        console.log(data)
        console.log(error)
        getData()
    }

    useEffect(() => {
        setComments([])
        setData([])
        getData()
    }, [])

    return (
        <div className="articlecon">
            <div className="isi">
                {
                    data.map((res, index) => (
                        <div key={index}>
                            <div className="title">{res.title}</div>
                            <div className="date">{res.email}, {res.date}</div>
                            <div className="body">{res.body}</div>
                        </div>
                    ))
                }
            </div>
            {/* <div className="commentscon">
                <h2>Comments</h2>
                {
                    comments == null ?
                        <div className="commentsection">
                            <div>There is no comment here.</div>
                        </div>
                        :
                        <div className="commentsection">
                            {
                                comments.map((komentar, index) => (
                                    <div key={index} className="comment">
                                        <div>{komentar.author}</div>
                                        <div>{komentar.comment}</div>
                                    </div>
                                ))
                            }
                        </div>
                }
                <div className="addcomment">
                    {
                        localStorage.getItem('email') == null ? 'You need to login first to comment' :
                            <>
                                <div>Add comment</div>
                                <form onSubmit={postComment}>
                                    <input name="comment" placeholder=" Your comment..." onChange={(e) => setInputComments(e.target.value)}></input>
                                    <input name="fromwho" defaultValue={localStorage.getItem('email')} style={{ display: 'none' }}></input>
                                    <input name="route" style={{ display: "none" }} defaultValue={title}></input>
                                    <input name="author" style={{ display: "none" }} defaultValue={content.email}></input>
                                    <button>Comment</button>
                                </form>
                            </>
                    }
                </div>
            </div> */}
        </div>

    );
}

export default Article;