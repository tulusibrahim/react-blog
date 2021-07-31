import { Link } from 'react-router-dom'
// import { useHistory } from "react-router";
import { supabase } from "../configs/configurations";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import MenuIcon from '@material-ui/icons/Menu';


const Navbar = (props) => {

    const session = supabase.auth.session()

    const logOut = async () => {
        await supabase.auth.signOut()

        document.location.reload()
    }

    return (

        // <AppBar position="static">
        //     <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        //         <div>
        //             <MenuIcon />
        //             News
        //         </div>
        //         <PersonIcon />
        //     </Toolbar>
        // </AppBar>


        <div className="navbarcon">
            <div className="navbar">
                <div className="title"><Link to="/" className="link" >Write</Link></div>
                <div className="right">
                    {/* <span><Link to="/" className="link">Browse</Link></span> */}
                    <span><Link to="/about" className="link">About Us</Link></span>
                    {
                        session !== null ?
                            <>
                                <Link to="/admin"><button style={{ fontWeight: 'normal' }}>{session !== null ? 'Manage Blogs' : 'Log In'}</button></Link>
                                <button onClick={logOut} style={{ fontWeight: 'normal' }}>{session !== null ? 'Log Out' : 'Log In'}</button>
                            </>
                            :
                            <Link to="/login"><button style={{ fontWeight: 'normal' }}>{session !== null ? 'Log Out' : 'Log In'} </button></Link>
                    }
                    {/* <Link to="/login"><button>{props.data == 'yes' ? 'Log Out' : 'Log In'}</button></Link> */}
                </div>
            </div>
        </div>
    );
}

export default Navbar;