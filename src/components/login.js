import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { supabase } from "../configs/configurations";
import swal from 'sweetalert';
import { Input, InputLeftAddon, InputGroup, InputLeftElement, Button, InputRightElement } from "@chakra-ui/react"
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

const Login = (props) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [login, setlogin] = useState('')
    const [show, setShow] = useState(false)
    let history = useHistory()

    const signUp = async (e) => {
        e.preventDefault()

        const { user, session, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        console.log(error)

        if (error) {
            swal("Failed to sign up, please try again", {
                icon: "warning",
            });
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
            // alert("Failed to sign in")
            swal("Failed to sign in. Please try again", {
                icon: "error",
            });
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
                        {/* <input placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} name="email"></input> */}
                        {/* <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} name="password"></input> */}
                        <Input variant="flushed" placeholder="Email" width="40%" color="white" onChange={(e) => setEmail(e.target.value)} required />
                        <InputGroup width="40%">
                            <Input variant="flushed" placeholder="Password" type={show ? "text" : "password"} color="white" onChange={(e) => setPassword(e.target.value)} required />
                            <InputRightElement >
                                <Button h="1.75rem" variant="outline" size="sm" colorScheme="whiteAlpha" onClick={() => setShow(!show)}>
                                    {show ? <ViewOffIcon /> : <ViewIcon />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <div className="formbtn">
                            <p>Have an account? Login <a style={{ cursor: 'pointer', color: '#536f8d' }} onClick={() => setlogin('true')}>here!</a></p>
                            {/* <button>Sign Up</button> */}
                            <Button variant="outline" marginTop="10px" colorScheme="whiteAlpha" _hover={{ backgroundColor: 'black', color: 'white' }} type="submit" fontWeight="normal">Sign Up</Button>
                        </div>
                    </form>
                    :
                    <form onSubmit={logIn}>
                        {/* <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} name="email" required></input> */}
                        {/* <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} name="password" required></input> */}
                        <Input variant="flushed" placeholder="Email" width="40%" color="white" onChange={(e) => setEmail(e.target.value)} required />
                        <InputGroup width="40%">
                            <Input variant="flushed" placeholder="Password" type={show ? "text" : "text"} color="white" onChange={(e) => setPassword(e.target.value)} required />
                            <InputRightElement >
                                <Button h="1.75rem" variant="outline" size="sm" colorScheme="whiteAlpha" onClick={() => setShow(!show)}>
                                    {show ? <ViewOffIcon /> : <ViewIcon />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <div className="formbtn">
                            <p>Don't have an account? Create one
                                <a style={{ cursor: 'pointer', color: '#536f8d' }} onClick={() => setlogin('false')}> here!</a>
                            </p>
                            {/* <button>Log In</button> */}
                            <Button variant="outline" marginTop="10px" colorScheme="whiteAlpha" _hover={{ backgroundColor: 'black', color: 'white' }} type="submit" fontWeight="normal">Log In</Button>
                        </div>
                    </form>
            }
            <p style={{ margin: '10px', color: 'white' }}>or login with</p>
            <div>
                <Button variant="outline" fontWeight="normal" colorScheme="whiteAlpha" _hover={{ backgroundColor: 'black', color: 'white' }} onClick={() => loginWithGithub()}><i className="fab fa-github"></i>&nbsp;Github</Button>
            </div>
        </div >
    );
};

export default Login;