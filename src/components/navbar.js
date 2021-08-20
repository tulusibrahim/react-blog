import { Link } from 'react-router-dom'
import { supabase } from "../configs/configurations";
import { useEffect, useState } from 'react';


const Navbar = (props) => {
    const session = supabase.auth.session()
    const [display, setDisplay] = useState('none')

    const logOut = async () => {
        await supabase.auth.signOut()

        document.location.reload()
    }

    useEffect(() => {
        setDisplay('none')
    }, [])

    return (
        <div className="navbarcon">
            <div className="navbar">
                <div className="title"><Link to="/" className="link" >Write</Link></div>
                <div className="right">
                    <i className="far fa-user-circle fa-lg" onClick={() => display == 'none' ? setDisplay('flex') : setDisplay('none')} >
                        <div style={{ display: display, transitionDelay: 1, flexDirection: 'column', position: 'absolute', right: 30, top: 20, zIndex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            {
                                session !== null ?
                                    <>
                                        <Link to="/admin">
                                            <button style={{ fontWeight: 'normal', padding: '3px' }}>{session !== null ? 'Profile' : 'Log In'}</button>
                                        </Link>
                                        <button onClick={logOut} style={{ fontWeight: 'normal', padding: '3px' }}>{session !== null ? 'Log Out' : 'Log In'}</button>
                                        <button style={{ padding: '3px' }}><Link to="/about" className="link">About Us</Link></button>
                                    </>
                                    :
                                    <>
                                        <Link to="/login">
                                            <button style={{ fontWeight: 'normal', padding: '3px' }}>{session !== null ? 'Log Out' : 'Log In'} </button>
                                        </Link>
                                        <button style={{ padding: '3px' }}><Link to="/about" className="link">About Us</Link></button>
                                    </>
                            }
                        </div>
                    </i>
                </div>
            </div>
        </div>
    );
}

export default Navbar;