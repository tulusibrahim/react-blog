import { useEffect } from "react";

const EditPost = (props) => {
    useEffect(() => {
        console.log(props)
    }, [])
    return (
        <div className="newblogcon">
            <div className="newblogdesc">Edit Blog</div>
            <form action="http://localhost:3100/updateblog" method="POST">
                <input placeholder="title" name="title" className="title" defaultValue={props.location.query.res.title}></input>
                <textarea style={{ overflow: 'auto' }} rows="10" cols="50" placeholder="body" name="body" className="body" defaultValue={props.location.query.res.body}></textarea>
                <input name="email" value={localStorage.getItem('email')} style={{ display: 'none' }}></input>
                <input name="id" style={{ display: 'none' }} value={props.location.query.res.id}></input>
                <button type="submit" className="button" >Update</button>
            </form>
        </div>
    );
}

export default EditPost;