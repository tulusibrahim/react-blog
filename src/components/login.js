import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { supabase } from "../configs/configurations";
import TextField from '@material-ui/core/TextField';

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
        e.target.reset()

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

    const loginWithGithub = async () => {
        const { user, session, error } = await supabase.auth.signIn({
            // provider can be 'github', 'google', 'gitlab', or 'bitbucket'
            provider: 'github'
        })
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
                        <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} name="password"></input>
                        <div className="formbtn">
                            <p>Have an account? Login <a style={{ cursor: 'pointer' }} onClick={() => setlogin('true')}>here!</a></p>
                            <button>Sign Up</button>
                        </div>
                    </form>
                    :
                    <form onSubmit={logIn}>
                        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} name="email" required></input>
                        {/* <TextField label="test" variant="filled" size="small" /> */}
                        <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} name="password" required></input>
                        <div className="formbtn">
                            <p>Don't have an account? Create one <a style={{ cursor: 'pointer' }} onClick={() => setlogin('false')}>here!</a></p>
                            <button>Log In</button>
                        </div>
                    </form>
            }
            <p style={{ margin: '10px' }}>or login with</p>
            <div>
                <button onClick={() => loginWithGithub()}><i class="fab fa-github"></i> Github</button>
            </div>
        </div >
    );
};

export default Login;