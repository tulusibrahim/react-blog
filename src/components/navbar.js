import { Link, useLocation } from 'react-router-dom'
import { supabase } from "../configs/configurations";
import { useEffect, useState } from 'react';
import { Box, Image, Menu, MenuButton, MenuItem, MenuList, useBreakpointValue } from '@chakra-ui/react';
import { createBreakpoints } from "@chakra-ui/theme-tools"
import { AiOutlineAlert, AiOutlineLogin, AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi'
import { BsPen } from 'react-icons/bs'
import { GrAlert } from 'react-icons/gr'
import swal from 'sweetalert';


const Navbar = (props) => {
    const [session, setSession] = useState(false)
    const [display, setDisplay] = useState('none')
    const [profilePic, setProfilePic] = useState('')
    const [nickName, setNickName] = useState('')
    let all = useLocation()

    const getProfilePic = async () => {
        let profilePic = await supabase.storage.from('blog').download(`profilePic/${supabase.auth.user().id}`)
        if (profilePic.data) {
            let image = URL.createObjectURL(profilePic.data)
            setProfilePic(image)
        }
    }

    const getUsername = async () => {
        let result = await supabase.from('blog_users').select('nickname').eq('id', supabase.auth.session().user.id)
        setNickName(result.data[0].nickname)
    }


    const logOut = async () => {
        swal({
            title: "Sure want to log out?",
            // text: "Once deleted, you will not be able to see the post anymore!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async res => {
                if (res) {
                    await supabase.auth.signOut()
                    document.location.reload()
                }
            })
    }

    useEffect(() => {
        setSession(supabase.auth.session())

        // setProfilePic('')
        if (session) {
            setNickName('')
            getUsername()
            getProfilePic()
        }
    }, [all])

    useEffect(() => {
        setDisplay('none')
        setSession(supabase.auth.session())
    }, [])

    return (
        <div className="navbarcon">
            <div className="navbar">
                <div className="title"><Link to="/" className="link" >Write</Link></div>
                <Box className="right" h="10vh" w={['60%', '40%', '30%', '20%']} d="flex" alignItems="center" justifyContent={session ? "space-evenly" : 'flex-end'}>
                    <Menu>
                        <MenuButton>
                            {
                                session &&
                                <Box fontSize="12px" fontWeight="normal" bg="#399930" p="4px" borderRadius="4px">
                                    {
                                        nickName ?
                                            nickName
                                            :
                                            (supabase.auth.user().email).replace('@gmail.com', '').replace('@yahoo.com', '').replace('@hotmail.com', '')
                                    }
                                </Box>
                            }
                        </MenuButton>
                        <MenuButton >
                            {
                                session ?
                                    <Image src={profilePic ? profilePic : `https://ui-avatars.com/api/?name=${supabase.auth.user().email}&length=1`} boxSize={['30px', '30px', '30px', '30px']} borderRadius="50%"></Image>
                                    // <div style={{ width: '30px', marginLeft: '10px' }}>
                                    //     <img src={profilePic ? profilePic : `https://ui-avatars.com/api/?name=${supabase.auth.user().email}&length=1`} style={{ width: '100%', borderRadius: '50px' }}></img>
                                    // </div>
                                    :
                                    <BiUser size="25px" />
                            }
                        </MenuButton>
                        <MenuList bg="#0D1B2A" borderColor="GrayText" >
                            {
                                session !== null ?
                                    <>
                                        <Link to="/profile">
                                            <MenuItem _focus={{ bg: "#1c3857" }} style={{ fontWeight: "normal" }} ><BiUser style={{ marginRight: '10px' }} />Profile</MenuItem>
                                        </Link>
                                        <Link to="/new">
                                            <MenuItem _focus={{ bg: "#1c3857" }} style={{ fontWeight: "normal" }}><BsPen style={{ marginRight: '10px' }} /> Write new</MenuItem>
                                        </Link>
                                        <MenuItem _focus={{ bg: "#1c3857" }} onClick={logOut} style={{ fontWeight: "normal" }}><AiOutlineLogout style={{ marginRight: '10px' }} /> Log out</MenuItem>
                                        <Link to="/about">
                                            <MenuItem _focus={{ bg: "#1c3857" }} style={{ fontWeight: "normal" }}><AiOutlineAlert style={{ marginRight: '10px' }} />About us</MenuItem>
                                        </Link>
                                    </>
                                    :
                                    <>
                                        <Link to="/login">
                                            <MenuItem _focus={{ bg: "#1c3857" }} style={{ fontWeight: "normal" }}><AiOutlineLogin style={{ marginRight: '10px' }} /> Log in</MenuItem>
                                        </Link>
                                        <Link to="/about">
                                            <MenuItem _focus={{ bg: "#1c3857" }} style={{ fontWeight: "normal" }}><AiOutlineAlert style={{ marginRight: '10px' }} />About us</MenuItem>
                                        </Link>
                                    </>
                            }
                        </MenuList>
                    </Menu>
                </Box>
            </div>
        </div>
    );
}

export default Navbar;