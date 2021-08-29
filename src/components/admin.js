import { useEffect, useRef, useState } from "react"
import { supabase } from "../configs/configurations"
import { Link } from "react-router-dom"
import moment from "moment";
import swal from 'sweetalert';
import { AiOutlineHeart, AiOutlineComment, AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import { FaSort } from 'react-icons/fa'
import { useToast, Tabs, TabList, TabPanels, Tab, TabPanel, Menu, MenuList, MenuItem, MenuButton, Button, Flex, Input, Image, InputGroup, InputLeftAddon, Box, useBreakpointValue, InputRightElement, color, Text, PopoverTrigger, PopoverContent, PopoverBody, Popover, PopoverArrow, PopoverCloseButton, PopoverHeader } from "@chakra-ui/react"
import { CheckIcon } from "@chakra-ui/icons";


const Admin = (props) => {
    const [data, setData] = useState('')
    const [warn, setWarn] = useState('')
    const [profile, setProfile] = useState([])
    const [profilePic, setProfilePic] = useState('')
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    let direction = useBreakpointValue({ base: 'column', md: 'row' })
    let sizeInput = useBreakpointValue({ base: '100%', md: '50%' })
    let toast = useToast()
    let toastRef = useRef()

    const deletePost = async (id) => {
        try {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to see the post anymore!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(async (willDelete) => {
                    console.log(willDelete)
                    if (willDelete) {
                        await deleteComment(id)
                        const { data, error } = await supabase
                            .from('blog')
                            .delete()
                            .match({ id: id })

                        if (error) {
                            swal("Failed delete post", {
                                icon: "warning",
                            });
                        }
                        else if (data) {
                            swal("Success delete data", {
                                icon: "success",
                            });
                        }
                        getData()
                    } else {
                        return
                    }
                });
        } catch (error) {
            swal("Something is error. Please try again", {
                icon: "warning",
            });
        }
    }

    const deleteComment = async (id) => {
        try {
            const { data, error } = await supabase
                .from('blog_comments')
                .delete()
                .match({ articleId: id })
            if (error) {
                swal("Failed to delete post comment", {
                    icon: "warning",
                });
            }

        } catch (error) {
            swal("Something is error. Please try again", {
                icon: "warning",
            });
        }
    }

    const getData = async () => {
        const user = supabase.auth.user()
        const { data, error } = await supabase
            .from('blog')
            .select(`
                        *,
                        blog_comments(
                            *
                        )
                    `)
            .eq('email', user.email)
        if (data == '') {
            setWarn('Your post will appear here.')
        }
        setData(data)
    }

    const handleSorting = (sort) => {
        switch (sort) {
            case 'new':
                let sortedData = data.map((a, b) => {
                    console.log(b.date)
                })
            // console.log(moment(data[8].date).format('MM dd yy'))
            // setData(sortedData)
        }
    }

    const getProfile = async () => {
        const userEmail = supabase.auth.user().email
        const { data, error } = await supabase
            .from('blog_users')
            .select('*')
            .eq('email', userEmail)
        setProfile(data[0])
        getProfilePicture()
    }

    const getProfilePicture = async () => {
        let { data, error } = await supabase
            .storage
            .from('blog')
            .getPublicUrl('blog-profilePic/tests.jpg')
        console.log(data)
        console.log(error)
        setProfilePic(data.publicURL)
    }

    const updateProfile = async (data) => {
        toastRef.current = toast({ description: "Loading...", status: "info" })

        if (data === 'bio') {
            let { data, error } = await supabase
                .from('blog_users')
                .update({ bio: bio })
                .eq('id', supabase.auth.user().id)

            if (data) {
                setBio('')
                if (toastRef.current) {
                    toast.update(toastRef.current, { description: "Success update bio", status: "success", isClosable: true })
                }
            }
            else if (error) {
                if (toastRef.current) {
                    toast.update(toastRef.current, { description: "Failed update bio", status: "error", isClosable: true })
                }
            }
        }
        else if (data === 'username') {
            let { data, error } = await supabase
                .from('blog_users')
                .update({ nickname: username })
                .eq('id', supabase.auth.user().id)

            if (data) {
                setUsername('')
                if (toastRef.current) {
                    toast.update(toastRef.current, { description: "Success update username", status: "success", isClosable: true })
                }
            }
            else if (error) {
                if (toastRef.current) {
                    toast.update(toastRef.current, { description: "Failed update username", status: "error", isClosable: true })
                }
            }
        }
    }

    useEffect(async () => {
        document.title = `Profile`
        setUsername('')
        setBio('')
        setData('')
        setWarn('')
        setProfile('')
        if (supabase.auth.session() == null) {
            setWarn("Login in to see your post")
        } else {
            getData()
            getProfile()
        }
    }, [])

    return (
        data == '' ?
            <h1 style={{ fontSize: '2rem', fontWeight: '500', color: 'white' }}>
                {warn}
            </h1>
            :
            <Tabs variant="line" size="md" isFitted >
                <TabList color="white">
                    <Tab>Manage Blogs</Tab>
                    <Tab>Manage Profile</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <div>
                            <div className="admin" style={{ flexDirection: 'column', width: '100%' }}>
                                <div style={{ width: '90%', paddingBottom: 20 }}>
                                    <div className="admin" style={{ justifyContent: "space-between", paddingTop: '20px' }}>
                                        <div>
                                            Your posts
                                        </div>
                                        <div className="sorting">
                                            <Menu >
                                                <MenuButton backgroundColor="#1c3857" _active={{ backgroundColor: '#1c3857' }} outline="none" _hover={{ backgroundColor: '#152b43' }} as={Button} leftIcon={<FaSort />}>
                                                    {/* <FaSort /> */}
                                                    Sort
                                                </MenuButton>
                                                <MenuList backgroundColor="#0D1B2A" >
                                                    <MenuItem backgroundColor="#0D1B2A" _hover={{ backgroundColor: '#152b43' }} onClick={() => handleSorting('new')}>Newest</MenuItem>
                                                    <MenuItem backgroundColor="#0D1B2A" _hover={{ backgroundColor: '#152b43' }} onClick={() => handleSorting('old')}>Oldest</MenuItem>
                                                    <MenuItem backgroundColor="#0D1B2A" _hover={{ backgroundColor: '#152b43' }} onClick={() => handleSorting('az')}>A - Z</MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </div>
                                    </div>
                                    {

                                        data.map(res => (
                                            <div className="" key={res.id} style={{ paddingTop: 12, display: 'flex', paddingBottom: 12, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', borderBottom: '.1px #838383 solid' }}>
                                                <div className="isi" style={{ width: '90%' }}>
                                                    <Link style={{ textDecoration: 'none', color: 'white' }} to={{ pathname: `/article/${res.title}`, query: { res } }}>
                                                        <div className="title" style={{ fontSize: "1.2em", marginBottom: '3px', textDecorationLine: 'none' }}>{res.title}</div>
                                                    </Link>
                                                    <div className="date" style={{ fontSize: "0.6em", color: '#a1a1a1', marginBottom: 10 }}>{res.date}</div>
                                                    <div style={{ display: 'flex', maxWidth: '20%', justifyContent: 'flex-start', marginTop: '5px' }}>
                                                        <div style={{ display: 'flex', width: 'fit-content', marginRight: '20px', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                                            {/* <i className="far fa-eye" style={{ marginRight: '10px' }} data-toggle="tooltip" title="Views"></i> */}
                                                            <AiOutlineEye style={{ marginRight: '10px' }} />
                                                            {
                                                                res.pageViews ? res.pageViews : '0'
                                                            }
                                                        </div>
                                                        <div style={{ display: 'flex', width: 'fit-content', marginRight: '20px', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                                            {/* <i className="far fa-heart" style={{ marginRight: '10px' }} data-toggle="tooltip" title="Likes"></i> */}
                                                            <AiOutlineHeart style={{ marginRight: '10px' }} />
                                                            {
                                                                res.likes ? res.likes : '0'
                                                            }
                                                        </div>
                                                        <div style={{ display: 'flex', width: 'fit-content', marginRight: '20px', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                                            {/* <i className="far fa-comment-dots" style={{ marginRight: '10px' }} data-toggle="tooltip" title="Comments"></i> */}
                                                            <AiOutlineComment style={{ marginRight: '10px' }} />
                                                            {
                                                                res.blog_comments.length ? res.blog_comments.length : '0'
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ width: '10%', textAlign: 'center', display: 'flex', flexDirection: "row", justifyContent: 'space-evenly' }}>
                                                    <div style={{ cursor: 'pointer' }}>
                                                        <Link to={{ pathname: '/edit', query: { res } }} style={{ color: 'white' }} data-toggle="tooltip" title="Edit">
                                                            {/* <i className="far fa-edit"></i> */}
                                                            <AiOutlineEdit size="1.3em" />
                                                        </Link>
                                                    </div>
                                                    <div onClick={() => deletePost(res.id)} style={{ cursor: 'pointer', color: '#dc3545' }} data-toggle="tooltip" title="Delete">
                                                        {/* <i className="far fa-trash-alt"></i> */}
                                                        <AiOutlineDelete size="1.3em" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '75vh', fontWeight: 'bolder', fontSize: 36, color: 'white' }}>
                        Coming Soon!
                    </div> */}
                        <Flex justifyContent="center">
                            <Flex color="white" h="75vh" alignItems="center" justifyContent="center" w="90%">
                                <Flex direction={direction} alignItems="center" justifyContent="space-evenly" h="70%" w="90%" >
                                    <Flex h="100%" alignItems="center" >
                                        <Image borderRadius="full" boxSize="150px" src={profilePic ? profilePic : `https://ui-avatars.com/api/?name=${supabase.auth.user().email}`} onError={() => setProfilePic('')}></Image>
                                    </Flex>
                                    <Flex h="60%" w={sizeInput} alignItems="center" justifyContent="space-between" direction="column">
                                        <Popover boundary="scrollParent" placement="top-start">
                                            <PopoverTrigger>
                                                <InputGroup mb={'10px'}>
                                                    <InputLeftAddon bg="none" children="Email" fontSize={14} color="grey" />
                                                    <Input variant="outline" value={supabase.auth.user().email} readOnly></Input>
                                                </InputGroup>
                                            </PopoverTrigger>
                                            <PopoverContent borderRadius={10} bg="blackAlpha.700" border="none">
                                                <PopoverHeader fontWeight="bold">Information!</PopoverHeader>
                                                <PopoverBody>Currently changing email is not supported yet :(</PopoverBody>
                                            </PopoverContent>
                                        </Popover>
                                        <InputGroup mb={'10px'}>
                                            <InputLeftAddon bg="none" children="Bio" fontSize={14} color="grey" />
                                            <Input variant="outline" placeholder="Bio" defaultValue={profile.bio ? profile.bio : ''} onChange={e => setBio(e.target.value)}></Input>
                                            <InputRightElement onClick={() => updateProfile('bio')} display={bio ? null : 'none'} children={<CheckIcon />} />
                                        </InputGroup>
                                        <Box w="100%">
                                            <InputGroup mb={'10px'}>
                                                <InputLeftAddon bg="none" children="Username" fontSize={14} color="grey" />
                                                <Input variant="outline" placeholder="Username" defaultValue={profile.nickname ? profile.nickname : ''} onChange={e => setUsername(e.target.value)}></Input>
                                                <InputRightElement onClick={() => updateProfile('username')} display={username ? null : 'none'} children={<CheckIcon />} />
                                            </InputGroup>
                                            <Text fontSize="sm" fontStyle="italic" textAlign="left" w="100%">*This username will appear in your blog post</Text>
                                        </Box>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex >
                    </TabPanel>
                </TabPanels>
            </Tabs>
    );
}

export default Admin;