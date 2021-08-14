import { supabase, uuidv4 } from "../configs/configurations";
import moment from 'moment'
import { useHistory } from "react-router-dom";
import React, { useState, useRef } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const NewBlog = () => {

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    let history = useHistory()

    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

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
                    <textarea rows="10" cols="50" placeholder="Body" onChange={(e) => setBody(e.target.value)} name="body" className="body" required></textarea>
                    <button type="submit" className="button" >Submit</button>
                </form>
            </div>
        // <div style={{ border: "1px solid black",backgroundColor:'white' }}>
        //     <Editor
        //         toolbarStyle={{ backgroundColor: 'white' }}
        //         editorStyle={{ backgroundColor: 'white' }}
        //         wrapperStyle={{ backgroundColor: 'white' }}
        //         toolbar={{ backgroundColor: 'none' }}
        //         editorState={editorState}
        //         onEditorStateChange={setEditorState}
        //     />
        // </div>
    );
}

export default NewBlog;