import { Link, useLocation } from 'react-router-dom'
import { supabase } from "../configs/configurations";
import { useEffect, useState } from 'react';
import { Image, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { AiOutlineUser } from 'react-icons/ai';


const Navbar = (props) => {
    const [session, setSession] = useState(false)
    const [display, setDisplay] = useState('none')
    const [profilePic, setProfilePic] = useState('')
    let all = useLocation()

    const getProfilePic = async () => {
        let profilePic = await supabase.storage.from('blog').getPublicUrl(`profilePic/${supabase.auth.user().id}.png`)
        profilePic.data.publicURL ? setProfilePic(profilePic.data.publicURL) : setProfilePic('')
    }

    const logOut = async () => {
        await supabase.auth.signOut()

        document.location.reload()
    }

    useEffect(() => {
        setSession(supabase.auth.session())
        // setProfilePic('')
        session &&
            getProfilePic()
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
                    <Menu>
                        <MenuButton>
                            {
                                session ?
                                    <Image src={profilePic ? `${profilePic}` : `https://ui-avatars.com/api/?name=${supabase.auth.user().email}`} borderRadius="full" boxSize="30px" ml='10px'></Image>
                                    :
                                    <AiOutlineUser size="30px" />
                            }
                        </MenuButton>
                        <MenuList bg="#0D1B2A" borderColor="GrayText">
                            {
                                session !== null ?
                                    <>
                                        <Link to="/profile">
                                            <MenuItem _focus={{ bg: "#1c3857" }}>Profile</MenuItem>
                                        </Link>
                                        <MenuItem _focus={{ bg: "#1c3857" }} onClick={logOut}>Log out</MenuItem>
                                        <Link to="/about">
                                            <MenuItem _focus={{ bg: "#1c3857" }}>About us</MenuItem>
                                        </Link>
                                    </>
                                    :
                                    <>
                                        <Link to="/login">
                                            <MenuItem _focus={{ bg: "#1c3857" }}>Log in</MenuItem>
                                        </Link>
                                        <Link to="/about">
                                            <MenuItem _focus={{ bg: "#1c3857" }}>About us</MenuItem>
                                        </Link>
                                    </>
                            }
                        </MenuList>
                    </Menu>
                </div>
            </div>
        </div>
    );
}

export default Navbar;