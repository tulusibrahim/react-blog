import { useEffect } from "react";

const About = () => {

    useEffect(() => {
        document.title = "About Us"
    }, [])

    return (
        <div className="about">
            <div>About Us</div>
            <div>Made with passion, since 21 Feb 2021</div>
        </div>
    );
}

export default About;