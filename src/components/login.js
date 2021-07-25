import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { supabase } from "../configs/configurations";
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

    const signUp = async (e) => {
        e.preventDefault()

        const { user, session, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            alert("Failed to sign up")
        }
        else {
            history.push('/')
            document.location.reload()
        }
    }

    const logIn = async (e) => {
        e.preventDefault()

        const { user, session, error } = await supabase.auth.signIn({
            email: email,
            password: password,
        })
        if (error) {
            alert("Failed to sign in")
        }
        else {
            history.push('/')
            document.location.reload()
        }
    }

    useEffect(async () => {
        let isLogin = await supabase.auth.session()
        if (isLogin !== null) {
            history.push('/')
        }
    }, [])

    return (
        <div className="logincon">
            {
                login == 'false' ?
                    <form onSubmit={signUp}>
                        <input placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} name="email"></input>
                        {/* <input placeholder="Nickname" onChange={(e) => setNickname(e.target.value)}></input> */}
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