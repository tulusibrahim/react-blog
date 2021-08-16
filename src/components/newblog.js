import { supabase, uuidv4 } from "../configs/configurations";
import moment from 'moment'
import { useHistory } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import RichTextEditor from './textEditor';

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
        e.preventDefault()
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
            alert('Failed to add post')
        }
        else {
            history.push('/')
        }
    }


    return (
        supabase.auth.session() == null ?
            <h1 style={{ fontSize: '2rem', fontWeight: '500', textAlign: 'center', color: 'white' }}>You need to log in first to create new post.</h1>
            :
            <div className="newblogcon">
                <div className="newblogdesc">Add New Blog</div>
                <form onSubmit={postData}>
                    <input placeholder="Title" onChange={(e => setTitle(e.target.value))} name="title" className="title" required></input>
                    <RichTextEditor getBody={setBody} />
                    {/* <input onChange={(e) => setTag(val => [...val, e.target.value])} placeholder="Tag"></input>
                <div>{tag}</div> */}
                    <button type="submit" className="button" >Submit</button>
                </form>
            </div>
    );
}

export default NewBlog;