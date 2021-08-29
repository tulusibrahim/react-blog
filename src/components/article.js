import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase, uuidv4 } from "../configs/configurations";
import moment from "moment";
import { Link } from "react-router-dom"
import parse from 'html-react-parser';
import swal from 'sweetalert';

const Article = (props) => {
    const { title } = useParams()
    const [data, setData] = useState([])
    const [comments, setComments] = useState([])
    const [inputComment, setInputComments] = useState('')
    const [session, setSession] = useState(false)
    const [display, setDisplay] = useState('none')

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
        setData(data)
        setComments(data[0].blog_comments)
        if (supabase.auth.session() == null) {
            updatePageViews(data[0].pageViews)
        }
        else if (supabase.auth.session().user.email !== data[0].email) {
            updatePageViews(data[0].pageViews)
        }
    }

    const getCommentData = async () => {
        // console.log(data[0].id)
        const { data, error } = await supabase
            .from('blog')
            .select(`
                *,
                blog_comments(
                    *
                )
            `)
            .eq('title', title)

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
        getCommentData()
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
            if (error) {
                swal("Failed to like", {
                    icon: "warning",
                });
            }
        }
        else {
            const { data, error } = await supabase
                .from('blog')
                .update({ likes: dataLikes[0].likes + 1 })
                .eq('title', title)
            if (error) {
                swal("Failed to like", {
                    icon: "warning",
                });
            }
        }
        getData()
    }

    const updatePageViews = async (dataViews) => {
        console.log(dataViews)
        const { data, error } = await supabase
            .from('blog')
            .update({ pageViews: dataViews + 1 })
            .eq('title', title)
    }

    useEffect(() => {
        setSession(false)
        setComments([])
        setData([])
        getData()
        setInputComments('')
        setSession(supabase.auth.session())
        document.title = title
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
                        <div>{comments ? comments.length : '0'}</div>
                    </div>
                </div>
                <div className="contentandcomment">
                    <div className="isi">
                        {
                            data.map((res, index) => (
                                <div key={index}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div className="title">{res.title}</div>
                                        {
                                            session &&
                                                supabase.auth.user().email === res.email ?
                                                <div>
                                                    <div className="articleoption" onClick={() => display == 'none' ? setDisplay('flex') : setDisplay('none')}>
                                                        <i className="fas fa-ellipsis-v"  >
                                                            <div style={{ display: display, transitionDelay: 1, flexDirection: 'column', position: 'absolute', right: 10, zIndex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                                                <div style={{ backgroundColor: '#12253a', padding: '10px', cursor: 'pointer' }}>
                                                                    <Link to={{ pathname: '/edit', query: { res } }} style={{ color: 'white', textDecoration: 'none', fontWeight: 'normal' }} data-toggle="tooltip" title="Edit">
                                                                        Edit post
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </i>
                                                    </div>
                                                </div>
                                                :
                                                null
                                        }
                                    </div>
                                    <div className="date">{(res.email).replace('@gmail.com', '').replace('@yahoo.com', '').replace('@hotmail.com', '')}, {res.date}</div>
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
                            <div>{comments ? comments.length : '0'}</div>
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
                                        comments &&
                                        comments.map((komentar, index) => (
                                            <div key={index} className="comment">
                                                <div style={{ fontSize: 16 }}>{(komentar.author).replace('@gmail.com', '').replace('@yahoo.com', '').replace('@hotmail.com', '').replace('@test', '').replace('@test.com', '')}</div>
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