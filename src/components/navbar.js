import { Link } from 'react-router-dom'
import { supabase } from "../configs/configurations";
import { useEffect, useState } from 'react';


const Navbar = (props) => {
    const session = supabase.auth.session()
    const [display, setDisplay] = useState('')

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
                    <i className="far fa-user-circle fa-lg" onClick={() => setDisplay(!display)} onMouseLeave={() => setDisplay('none')} onMouseEnter={() => setDisplay('flex')}>
                        <div style={{ display: display, transitionDelay: 1, flexDirection: 'column', position: 'absolute', right: 30, top: 20, zIndex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            {
                                session !== null ?
                                    <>
                                        <Link to="/admin">
                                            <button style={{ fontWeight: 'normal' }}>{session !== null ? 'Manage Blogs' : 'Log In'}</button>
                                        </Link>
                                        <button onClick={logOut} style={{ fontWeight: 'normal' }}>{session !== null ? 'Log Out' : 'Log In'}</button>
                                        <button><Link to="/about" className="link">About Us</Link></button>
                                    </>
                                    :
                                    <>
                                        <Link to="/login">
                                            <button style={{ fontWeight: 'normal' }}>{session !== null ? 'Log Out' : 'Log In'} </button>
                                        </Link>
                                        <button><Link to="/about" className="link">About Us</Link></button>
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