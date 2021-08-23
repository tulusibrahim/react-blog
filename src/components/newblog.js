import { supabase, uuidv4 } from "../configs/configurations";
import moment from 'moment'
import { useHistory } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import swal from 'sweetalert';
// ES module
import Editor from 'react-medium-editor';
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/beagle.css');


const NewBlog = () => {

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [tag, setTag] = useState([])
    let history = useHistory()

    useEffect(() => {
        console.log(body)
        // let parse = JSON.parse(body)
        // setBody(parse._immutable.currentContent)
    }, [body])

    const postData = async (e) => {
        // e.preventDefault()
        if (title == '' || body == '') {
            swal("Title or body can not be empty.", {
                icon: "warning",
            });
        }
        else {
            const user = supabase.auth.user()
            const { data, error } = await supabase
                .from('blog')
                .insert([
                    {
                        id: uuidv4(),
                        title: title,
                        body: body,
                        email: user.email,
                        date: moment().format('DD MMMM YYYY'),
                    }
                ])
            if (error) {
                console.log(error)
                swal("Failed to add new post, please try again", {
                    icon: "warning",
                });
            }
            else {
                history.push('/')
            }
        }
    }

    const tagging = async (tag) => {
        console.log(tag)
        // const { data, error } = await supabase.from('blog_tags').select().filter('name', 'eq', 'hiyaaa')
        // console.log(data[0])
        // let neww = data[0].articleId
        // neww.push("tambah lage")
        // console.log(neww)

        // const { dataa, errorr } = await supabase
        //     .from('blog_tags')
        //     .update({
        //         articleId: neww
        //     })
        //     .filter('name', 'eq', 'hiyaaa')

        // const { datar, errora } = await supabase.from('blog_tags').select()
        // console.log(datar)
    }

    useEffect(() => {
        document.title = "New Blog"
    }, [])


    return (
        supabase.auth.session() == null ?
            <h1 style={{ fontSize: '2rem', fontWeight: '500', textAlign: 'center', color: 'white' }}>You need to log in first to create new post.</h1>
            :
            <div className="newblogconwrapper">
                <div className="newblogcon">
                    <div className="headerwrapper">
                        {/* <div className="newblogdesc">Add New Blog</div> */}
                        <button type="submit" className="button" onClick={() => postData()}>Submit</button>
                    </div>
                    <form onSubmit={postData}>
                        <input placeholder="Title" onChange={(e => setTitle(e.target.value))} name="title" className="title" required></input>
                        <Editor
                            style={{ width: '100%', paddingTop: '1rem', paddingBottom: '1rem', color: 'white', backgroundColor: '#12253a', outline: 'none' }}
                            text={body}
                            theme="beagle"
                            onChange={e => setBody(e)}
                        />
                        {/* <RichTextEditor getBody={setBody} /> */}
                        {/* <input onChange={(e) => tagging(e.target.value)} placeholder="Tag"></input>
                <div>{tag}</div> */}
                    </form>
                </div>
            </div>
    );
}

export default NewBlog;