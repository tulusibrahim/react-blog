import { Link } from 'react-router-dom'
// import { useHistory } from "react-router";
import { supabase } from "../configs/configurations";


const Navbar = (props) => {

    const session = supabase.auth.session()

    const logOut = async () => {
        await supabase.auth.signOut()
        document.location.reload()
    }

    return (
        <div className="navbarcon">
            <div className="navbar">
                <div className="title"><Link to="/" className="link" >Write</Link></div>
                <div className="right">
                    {/* <span><Link to="/" className="link">Browse</Link></span> */}
                    <span><Link to="/about" className="link">About Us</Link></span>
                    {
                        session !== null ?
                            <>
                                <Link to="/admin"><button>{session !== null ? 'Manage Blogs' : 'Log In'}</button></Link>
                                <button onClick={logOut}>{session !== null ? 'Log Out' : 'Log In'} <i className="fas fa-sign-out-alt"></i></button>
                            </>
                            :
                            <Link to="/login"><button>{session !== null ? 'Log Out' : 'Log In'} <i className="fas fa-sign-in-alt"></i></button></Link>
                    }
                    {/* <Link to="/login"><button>{props.data == 'yes' ? 'Log Out' : 'Log In'}</button></Link> */}
                </div>
            </div>
        </div>
    );
}

export default Navbar;