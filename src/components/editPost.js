import { useEffect, useState } from "react";
import { supabase } from "../configs/configurations";
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import { Input } from "@chakra-ui/react"
import Editor from 'react-medium-editor';
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/beagle.css');

const EditPost = (props) => {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    let history = useHistory()

    const postEdit = async (e) => {
        // e.preventDefault()
        const { data, error } = await supabase
            .from('blog')
            .update({ title: title ? title : props.location.query.res.title, body: body ? body : props.location.query.res.body })
            .match({ title: props.location.query.res.title })
        if (data) {
            history.push('/profile')
        }
        else {
            swal("Failed to update post, please try again", {
                icon: "warning",
            });
        }
    }
    //borderBottom: '1px #E0E1DD solid',

    useEffect(() => {
        document.title = `Edit Post`
        console.log(body)
        setBody(props.location.query.res.body)
    }, [])

    return (
        <div className="newblogconwrapper">
            <div className="newblogcon">
                <div className="headerwrapper">
                    {/* <div className="newblogdesc">Edit Blog</div> */}
                    <button style={{ backgroundColor: "#0D1B2A" }} type="submit" className="button" onClick={() => postEdit()}>Update</button>
                </div>
                <form onSubmit={postEdit}>
                    {/* <input style={{ backgroundColor: "#0D1B2A" }} placeholder="title" name="title" className="title" onChange={(e) => setTitle(e.target.value)} defaultValue={props.location.query.res.title}></input> */}
                    <Input variant="flushed" placeholder="Title" mb={'10px'} color="white" onChange={(e => setTitle(e.target.value))} defaultValue={props.location.query.res.title} />
                    {/* <textarea style={{ overflow: 'auto' }} rows="10" cols="50" onChange={(e) => setBody(e.target.value)} placeholder="body" name="body" className="body" defaultValue={props.location.query.res.body}></textarea> */}
                    <Editor
                        style={{ width: '100%', paddingTop: '1rem', paddingBottom: '1rem', color: 'white', backgroundColor: '#12253a', outline: 'none' }}
                        text={body}
                        theme="beagle"
                        onChange={e => setBody(e)}
                    />
                    <input name="email" value={localStorage.getItem('email')} style={{ display: 'none' }}></input>
                    <input name="id" style={{ display: 'none' }} value={props.location.query.res.id}></input>
                </form>
            </div>
        </div>
    );
}

export default EditPost;