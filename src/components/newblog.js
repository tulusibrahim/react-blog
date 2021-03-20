import { useState } from "react";

const NewBlog = () => {

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')

    const monthNames = ["Jan", "Feb", "March", "Apr", "May", "Jun",
        "July", "August", "Sept", "Oct", "Nov", "Dec"
    ];

    let date = new Date()
    let getDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`

    // const submitForm = () => {
    //     fetch('http://localhost:3100/new', { method: "POST", body: { title, getDate, body } })
    // }
    let style = { fontSize: '2rem', fontWeight: '500', textAlign: 'center', color: 'white' }

    return (
        localStorage.getItem('email') == null ? <h1 style={style}>Log in first atuh boi</h1> :
            <div className="newblogcon">
                <div className="newblogdesc">Add New Blog</div>
                <form method="POST" action="http://localhost:3100/new">
                    <input placeholder="title" onChange={setTitle} name="title" className="title"></input>
                    <input placeholder="body" onChange={setBody} name="body" className="body"></input>
                    <input value={getDate} style={{ display: 'none' }} name="date"></input>
                    <input name="email" value={localStorage.getItem('email')} style={{ display: 'none' }}></input>
                    <button>Submit</button>
                </form>
            </div>
    );
}

export default NewBlog;