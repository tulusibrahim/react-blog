import { useEffect, useState } from "react";
import { supabase } from "../configs/configurations";
import { useHistory } from "react-router-dom";
import RichTextEditor from './textEditor';
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";

const EditPost = (props) => {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    let history = useHistory()

    const postEdit = async (e) => {
        e.preventDefault()
        const { data, error } = await supabase
            .from('blog')
            .update({ title: title ? title : props.location.query.res.title, body: body ? body : props.location.query.res.body })
            .match({ title: props.location.query.res.title })
        if (data) {
            history.push('/admin')
        }
        else {
            alert('Failed to update post')
        }
    }

    useEffect(() => {
        console.log(body)
    }, [body])

    return (
        <div className="newblogcon">
            <div className="newblogdesc">Edit Blog</div>
            <form onSubmit={postEdit}>
                <input placeholder="title" name="title" className="title" onChange={(e) => setTitle(e.target.value)} defaultValue={props.location.query.res.title}></input>
                {/* <textarea style={{ overflow: 'auto' }} rows="10" cols="50" onChange={(e) => setBody(e.target.value)} placeholder="body" name="body" className="body" defaultValue={props.location.query.res.body}></textarea> */}
                {/* <RichTextEditor getBody={setBody} data={props.location.query.res.body} /> */}
                <input name="email" value={localStorage.getItem('email')} style={{ display: 'none' }}></input>
                <input name="id" style={{ display: 'none' }} value={props.location.query.res.id}></input>
                <button type="submit" className="button" >Update</button>
            </form>
        </div>
    );
}

export default EditPost;