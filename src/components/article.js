import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase, uuidv4 } from "../configs/configurations";
import moment from "moment";
import { Link } from "react-router-dom"
import parse from 'html-react-parser';
import swal from 'sweetalert';
import { Flex, Menu, MenuButton, MenuItem, MenuList, Tag, Text } from "@chakra-ui/react";

const Article = (props) => {
    const { title } = useParams()
    const [data, setData] = useState([])
    const [comments, setComments] = useState([])
    const [tags, setTags] = useState([])
    const [inputComment, setInputComments] = useState('')
    const [session, setSession] = useState(false)
    const [profilePic, setProfilePic] = useState('')

    const getData = async () => {
        const { data, error } = await supabase
            .from('blog')
            .select(`
                *,
                blog_comments(*),
                blog_users(*),
                blog_tags(*)
            `)
            .match({ title: title, isDraft: 'false' })
        console.log(data[0])
        setData(data)
        setComments(data[0].blog_comments)
        setTags(data[0].blog_tags)

        if (data[0].blog_users) {
            getProfilePic(data[0].blog_users.id)
        }

        if (supabase.auth.session() == null) {
            updatePageViews(data[0].pageViews)
        }
        else if (supabase.auth.session().user.email !== data[0].email) {
            updatePageViews(data[0].pageViews)
        }
    }

    const getProfilePic = async (id) => {
        console.log(id)
        let profilePic = await supabase.storage.from('blog').download(`profilePic/${id}`)
        if (profilePic.data) {
            let image = URL.createObjectURL(profilePic.data)
            setProfilePic(image)
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

    function getText() {
        if (window.getSelection) {
            alert(window.getSelection())
        } else if (window.document.getSelection) {
            alert(window.document.getSelection())
        } else if (window.document.selection) {
            alert(window.document.selection.createRange().text)
        }
    }

    useEffect(() => {
        setSession(false)
        setComments([])
        setData([])
        getData()
        setInputComments('')
        setProfilePic('')
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
                                        <Text fontSize={["24px", "28px", "28px", "32px"]} fontWeight="semibold">{res.title}</Text>
                                        {
                                            session &&
                                                supabase.auth.user().email === res.email ?
                                                <div>
                                                    <Menu>
                                                        <MenuButton>
                                                            <div className="articleoption" >
                                                                <i className="fas fa-ellipsis-v"  ></i>
                                                            </div>
                                                        </MenuButton>
                                                        <MenuList bg="#0D1B2A" borderColor="GrayText">
                                                            <Link to={{ pathname: '/edit', query: { res } }} style={{ color: 'white', textDecoration: 'none', fontWeight: 'normal' }} data-toggle="tooltip" title="Edit">
                                                                <MenuItem _focus={{ bg: "#1c3857" }}>
                                                                    Edit post
                                                                </MenuItem>
                                                            </Link>
                                                        </MenuList>
                                                    </Menu>
                                                </div>
                                                // </div>
                                                :
                                                null
                                        }
                                    </div>
                                    <div className="date">
                                        <img src={profilePic ? profilePic : `https://ui-avatars.com/api/?name=${res.email}&length=1`} width="25px" style={{ borderRadius: '50px', marginRight: '10px' }}></img>
                                        {
                                            res?.blog_users?.nickname ?
                                                <>
                                                    <Link to={{ pathname: `/${res.blog_users.nickname}`, query: { res } }}>
                                                        <Text fontSize={["14px", "15px", "15px", "16px"]} >{res.blog_users.nickname}, &nbsp;</Text>
                                                    </Link>
                                                    <Text fontSize={["14px", "15px", "15px", "16px"]} >{res.date}</Text>
                                                </>
                                                :
                                                <>
                                                    {/* <Link to={{ pathname: `/${(res.email).replace('@gmail.com', '').replace('@yahoo.com', '').replace('@hotmail.com', '')}`, query: { res } }}> */}
                                                    <Text fontSize={["14px", "15px", "15px", "16px"]}>{(res.email).replace('@gmail.com', '').replace('@yahoo.com', '').replace('@hotmail.com', '')}, &nbsp;</Text>
                                                    {/* </Link> */}
                                                    <Text fontSize={["14px", "15px", "15px", "16px"]}>{res.date}</Text>
                                                </>
                                        }
                                    </div>
                                    <Text className="body" fontSize={["16px", "17px", "17px", "18px"]}>{parse(res.body)}</Text>
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
                    <Flex w="100%" justify="flex-start" mt="10px" wrap="wrap">
                        {
                            tags.map(res => (
                                <Link to={{ pathname: `/topic/${(res.name).replace("#", '')}` }}>
                                    <Tag m="5px" colorScheme="telegram" _hover={{ bgColor: '#3c7592', color: 'white', transition: '.2s' }}>{res.name}</Tag>
                                </Link>
                            ))
                        }
                    </Flex>
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