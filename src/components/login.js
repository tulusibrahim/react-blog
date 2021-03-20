import { useState } from "react";
import { useHistory } from "react-router-dom";
import fire from '../firebase'

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
    let history = useHistory()

    const signUp = (e) => {
        e.preventDefault()

        fire.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                history.push("/login")
            })
            .catch(err => {
                alert(err.code)
            })
    }

    const logIn = (e) => {
        e.preventDefault()

        fire.auth()
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                props.getuser(email)
                console.log(res.user.email)
                console.log(res.user)
                localStorage.setItem('email', res.user.email)
                localStorage.setItem('isLogin', 'yes')
                props.isLogin('yes')
                history.push('/admin')
            })
            .catch(err => {
                alert(err.message)
            })
    }

    return (
        <div className="logincon">
            {login == 'false' ?
                <form onSubmit={signUp}>
                    <input placeholder="Username" type="email" onChange={(e) => setEmail(e.target.value)} name="email"></input>
                    <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} name="password"></input>
                    <button>Sign Up</button>
                </form> :
                <form onSubmit={logIn}>
                    <input placeholder="Username" onChange={(e) => setEmail(e.target.value)} name="email"></input>
                    <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} name="password"></input>
                    <p>Dont have an account? Create one <a href="#" onClick={() => setlogin('false')}>here!</a></p>
                    <button>Log In</button>
                </form>
            }
        </div>
    );
};

export default Login;