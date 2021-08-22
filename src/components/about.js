import { useEffect } from "react";

const About = () => {

    useEffect(() => {
        document.title = "About Us"
    })

    return (
        <div className="about">
            <div>About Us</div>
            <div>Copyright &copy; since Feb 21, 2021</div>
        </div>
    );
}

export default About;