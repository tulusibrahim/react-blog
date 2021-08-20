import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase, uuidv4 } from "../configs/configurations";
import moment from "moment";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from 'draft-js-export-html';
import parse from 'html-react-parser';

const Article = (props) => {
    const { title } = useParams()
    const [data, setData] = useState([])
    const [comments, setComments] = useState([])
    const [inputComment, setInputComments] = useState('')

    const getData = async () => {
        const { data, error } = await supabase
            .from('blog')
            .select(`
                *,
                blog_comments(
                    *
                )
            `)
            .eq('title', title)
        console.log(data)
        setData(data)
        setComments(data[0].blog_comments)
    }

    const postComment = async (e) => {
        e.preventDefault()
        e.target.reset()
        setInputComments('')
        const { dataa, error } = await supabase
            .from('blog_comments')
            .insert([
                {
                    id: uuidv4(),
                    articleId: data[0].id,
                    author: supabase.auth.user().email,
                    comment: inputComment,
                    time: moment().format('DD MMMM YYYY')
                }
            ])
        getData()
    }

    const addLikes = async () => {
        const { data: dataLikes, error } = await supabase
            .from('blog')
            .select('likes')
            .eq('title', title)

        if (data[0].likes == null) {
            const { data, error } = await supabase
                .from('blog')
                .update({ likes: 1 })
                .eq('title', title)
            if (error) alert('Failed to like')
        }
        else {
            const { data, error } = await supabase
                .from('blog')
                .update({ likes: dataLikes[0].likes + 1 })
                .eq('title', title)
            if (error) alert('Failed to like')
        }
        getData()
    }

    useEffect(() => {
        setComments([])
        setData([])
        getData()
        setInputComments('')
    }, [])

    return (
        <div className="articleconwrapper">
            <div className="articlecon">
                <div className="likes">
                    <div className="icon">
                        <i className="far fa-heart" onClick={addLikes}></i>
                        <div>{data.map(like => like.likes == null ? 0 : like.likes)}</div>
                    </div>
                    <div className="icon">
                        <i className="far fa-comment-dots"></i>
                        <div>{comments.length}</div>
                    </div>
                </div>
                <div className="contentandcomment">
                    <div className="isi">
                        {
                            data.map((res, index) => (
                                <div key={index}>
                                    <div className="title">{res.title}</div>
                                    <div className="date">{res.email}, {res.date}</div>
                                    <div className="body">{parse(res.body)}</div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="likesBottom">
                        <div className="icon">
                            <i className="far fa-heart" onClick={addLikes}></i>
                            <div>{data.map(like => like.likes == null ? 0 : like.likes)}</div>
                        </div>
                        <div className="icon">
                            <i className="far fa-comment-dots"></i>
                            <div>{comments.length}</div>
                        </div>
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
                                    {
                                        comments.map((komentar, index) => (
                                            <div key={index} className="comment">
                                                <div style={{ fontSize: 16 }}>{komentar.author}</div>
                                                <div style={{ fontSize: 20 }}>{komentar.comment}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                        }
                        <div className="addcomment">
                            {
                                supabase.auth.session() == null ? 'You need to login first to comment' :
                                    <>
                                        <div>Add comment</div>
                                        <form onSubmit={postComment}>
                                            <input name="comment" placeholder=" Your comment..." onChange={(e) => setInputComments(e.target.value)} required></input>
                                            <button>Comment</button>
                                        </form>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Article;