import axios from "axios";
import { useState } from "react";

const NewBlog = () => {

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')

    const monthNames = ["Jan", "Feb", "March", "Apr", "May", "Jun",
        "July", "August", "Sept", "Oct", "Nov", "Dec"
    ];
    let date = new Date()
    let getDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
    let style = { fontSize: '2rem', fontWeight: '500', textAlign: 'center', color: 'white' }

    return (
        localStorage.getItem('email') == null ?
            <h1 style={style}>Log in first atuh boi</h1>
            :
            <div className="newblogcon">
                <div className="newblogdesc">Add New Blog</div>
                <form action="http://localhost:3100/new" method="POST">
                    <input placeholder="Title" onChange={setTitle} name="title" className="title" required></input>
                    <textarea rows="10" cols="50" placeholder="Body" onChange={setBody} name="body" className="body" required></textarea>
                    <input value={getDate} style={{ display: 'none' }} name="date"></input>
                    <input name="email" value={localStorage.getItem('email')} style={{ display: 'none' }}></input>
                    <button type="submit" className="button" >Submit</button>
                </form>
            </div>
    );
}

export default NewBlog;