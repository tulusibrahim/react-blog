import { Link } from 'react-router-dom'
const Navbar = (props) => {

    return (
        <div className="navbarcon">
            <div className="navbar">
                <div className="title"><Link to="/" className="link" >Blog2an</Link></div>
                <div className="right">
                    {/* <span><Link to="/" className="link">Browse</Link></span> */}
                    <span><Link to="/about" className="link">About Us</Link></span>
                    {localStorage.getItem('isLogin') == 'yes' ?
                        <>
                            <Link to="/logout"><button>{localStorage.getItem('isLogin') == 'yes' ? 'Log Out' : 'Log In'}</button></Link>
                            <Link to="/admin"><button>{localStorage.getItem('isLogin') == 'yes' ? 'Manage Blogs' : 'Log In'}</button></Link>
                        </>
                        : <Link to="/login"><button>{localStorage.getItem('isLogin') == 'yes' ? 'Log Out' : 'Log In'}</button></Link>
                    }
                    {/* <Link to="/login"><button>{props.data == 'yes' ? 'Log Out' : 'Log In'}</button></Link> */}
                </div>
            </div>
        </div>
    );
}

export default Navbar;