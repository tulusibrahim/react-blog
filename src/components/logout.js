import { useHistory } from "react-router";

const Logout = (props) => {
    localStorage.clear()
    props.isLogin('no')
    useHistory().push('/')
    return (
        <div>Redirecting...</div>
    );
}

export default Logout;