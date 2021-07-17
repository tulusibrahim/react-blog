import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import fire from '../firebase'
import axios from "axios";

// alert("Still working on it!")
// let datee = new Date()
// const monthNames = ["Jan", "Feb", "March", "Apr", "May", "Jun",
//     "July", "August", "Sept", "Oct", "Nov", "Dec"
// ];
// let title = username
// let body = password
// let date = `${datee.getDate()} ${monthNames[datee.getMonth()]} ${datee.getFullYear()}`
// let data = { title, body, date }

const Login = (props) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [login, setlogin] = useState('')
    const [nickname, setNickname] = useState('')
    let history = useHistory()

    const signUp = (e) => {
        e.preventDefault()
        let form = new FormData()
        form.append('username', 'haha')

        // fetch('http://localhost:3100/newuser', { body: JSON.stringify({ username: 'haha' }), method: 'post' })

        axios.post(`http://localhost:3100/newuser/${email}/${nickname}/${password}`)
            .then(res => {
                if (res.data.message == 'failed') {
                    alert('Login failed')
                }
                else {
                    history.push('https://wr8.herokuapp.com/')
                }
            })

        // fire.auth()
        //     .createUserWithEmailAndPassword(email, password)
        //     .then(() => {
        //         history.push("/login")
        //     })
        //     .catch(err => {
        //         alert(err.code)
        //     })
    }

    const logIn = (e) => {
        e.preventDefault()

        axios.post(`http://localhost:3100/login/${email}/${password}`)
            .then(res => {
                if (res.data.message == 'failed') {
                    alert('Login failed')
                }
                else {
                    history.push('https://wr8.herokuapp.com/')
                    localStorage.setItem('email', email)
                    localStorage.setItem('isLogin', 'yes')
                    props.isLogin('yes')
                }
            })

        // fire.auth()
        //     .signInWithEmailAndPassword(email, password)
        //     .then((res) => {
        //         props.getuser(email)
        //         console.log(res.user.email)
        //         console.log(res.user)
        //         localStorage.setItem('email', res.user.email)
        //         localStorage.setItem('isLogin', 'yes')
        //         props.isLogin('yes')
        //         history.push('/')
        //     })
        //     .catch(err => {
        //         alert(err.message)
        //     })
    }

    useEffect(() => {
        let cache = localStorage.getItem('isLogin')
        if (cache !== null) {
            history.push('https://wr8.herokuapp.com/')
        }
    }, [])

    return (
        <div className="logincon">
            {
                login == 'false' ?
                    <form onSubmit={signUp}>
                        <input placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} name="email"></input>
                        <input placeholder="Nickname" onChange={(e) => setNickname(e.target.value)}></input>
                        <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} name="password"></input>
                        <button>Sign Up</button>
                    </form>
                    :
                    <form onSubmit={logIn}>
                        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} name="email" required></input>
                        <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} name="password" required></input>
                        <p>Dont have an account? Create one <a href="#" onClick={() => setlogin('false')}>here!</a></p>
                        <button>Log In</button>
                    </form>
            }
        </div >
    );
};

export default Login;