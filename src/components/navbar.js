import { Link, useLocation } from 'react-router-dom'
import { supabase } from "../configs/configurations";
import { useEffect, useState } from 'react';


const Navbar = (props) => {
    const [session, setSession] = useState(false)
    const [display, setDisplay] = useState('none')
    let all = useLocation()

    const logOut = async () => {
        await supabase.auth.signOut()

        document.location.reload()
    }

    useEffect(() => {
        setSession(supabase.auth.session())
    }, [all])

    useEffect(() => {
        setDisplay('none')
    }, [])

    return (
        <div className="navbarcon">
            <div className="navbar">
                <div className="title"><Link to="/" className="link" >Write</Link></div>
                <div className="right">
                    {
                        session &&
                        <div style={{ fontSize: 12, backgroundColor: '#399930', padding: 4, borderRadius: 5 }}>
                            {
                                (supabase.auth.user().email).replace('@gmail.com', '').replace('@yahoo.com', '').replace('@hotmail.com', '')
                            }
                        </div>
                    }
                    <i className="far fa-user-circle fa-lg" onClick={() => display == 'none' ? setDisplay('flex') : setDisplay('none')} style={{ marginLeft: 10 }}> </i>
                    <div style={{ display: display, transitionDelay: 1, flexDirection: 'column', position: 'absolute', right: 10, top: 25, zIndex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        {
                            session !== null ?
                                <>
                                    <Link to="/profile">
                                        <button style={{ fontWeight: 'normal', padding: '2px', backgroundColor: "#12253a", minWidth: "70px" }}>{session !== null ? 'Profile' : 'Log in'}</button>
                                    </Link>
                                    <button onClick={logOut} style={{ fontWeight: 'normal', padding: '2px', backgroundColor: "#12253a", minWidth: "70px" }}>{session !== null ? 'Log out' : 'Log in'}</button>
                                    <button style={{ padding: '2px', backgroundColor: "#12253a", minWidth: "70px" }}><Link to="/about" className="link">About us</Link></button>
                                </>
                                :
                                <>
                                    <Link to="/login">
                                        <button style={{ fontWeight: 'normal', padding: '2px', backgroundColor: "#12253a", minWidth: "70px" }}>{session !== null ? 'Log out' : 'Log in'} </button>
                                    </Link>
                                    <button style={{ padding: '2px', backgroundColor: "#12253a", minWidth: "70px" }}><Link to="/about" className="link">About us</Link></button>
                                </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;