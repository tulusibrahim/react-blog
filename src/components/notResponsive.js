import { useEffect } from "react";
import { useHistory } from "react-router";

const NotResponsive = () => {
    let history = useHistory()

    let style = { fontSize: '2rem', fontWeight: '500', color: 'white', textAlign: 'center' }

    useEffect(() => {
        if (window.screen.width > 992) {
            history.push("https://wr8.herokuapp.com/")
        }
    }, [])
    return (
        <>
            <h1 style={style}>Sorry, the website is not responsive yet :(</h1>
        </>
    );
}

export default NotResponsive;