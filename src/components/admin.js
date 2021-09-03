import { useEffect, useRef, useState } from "react"
import { supabase } from "../configs/configurations"
import { Link } from "react-router-dom"
import moment from "moment";
import swal from 'sweetalert';
import { AiOutlineHeart, AiOutlineComment, AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlineCloudUpload } from 'react-icons/ai'
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
    const [sortState, setSortState] = useState('')
    const [image, setImage] = useState("");
    const inputFile = useRef(null);
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
                        await deleteTag(id)
                        const { data, error } = await supabase
                            .from('blog')
                            .delete()
                            .match({ id: id })
                        console.log(error)

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

    const deleteTag = async (id) => {
        try {
            const { data, error } = await supabase
                .from('blog_postTag')
                .delete()
                .match({ post_id: id })
            if (error) {
                swal("Failed to delete post tag", {
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

    const handleSorting = async (sort) => {
        const user = supabase.auth.user()
        if (sort === 'az') {
            setSortState('az')
            let result = await supabase
                .from('blog')
                .select(`*, blog_comments(*)`)
                .eq('email', user.email)
                .order('title', { ascending: true })
            console.log(result)
            setData(result.data)
        }
        else if (sort === 'za') {
            setSortState('za')
            let result = await supabase
                .from('blog')
                .select(`*, blog_comments(*)`)
                .eq('email', user.email)
                .order('title', { ascending: false })
            console.log(result)
            setData(result.data)
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
        setProfilePic('')
        let userId = supabase.auth.user().id
        let path = `profilePic/${userId}`
        let { data, error } = await supabase
            .storage
            .from('blog')
            .getPublicUrl(path)
        console.log(data.publicURL)
        console.log(error)
        // console.log(result)
        // console.log(data)
        // console.log(error)
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

    const handleFileUpload = async e => {
        toastRef.current = toast({ description: "Loading...", status: "info" })
        const { files } = e.target;
        const userId = supabase.auth.user().id

        if (files && files.length) {
            console.log(files[0])
            // alert("update")
            const { data, error } = await supabase
                .storage
                .from('blog')
                .upload(`profilePic/${userId}`, files[0], { upsert: true })
            console.log(data)
            console.log(error)
            toastRef.current = toast({ description: "Success upload photo", status: "success" })
        }
    };

    useEffect(async () => {
        document.title = `Profile`
        // const { data, error } = await supabase
        //     .storage
        //     .from('blog')
        //     .list('profilePic', {
        //         limit: 100,
        //         offset: 0
        //     })
        // console.log(data)
        setUsername('')
        setBio('')
        setData('')
        setSortState('')
        setWarn('')
        setProfile('')
        setProfilePic('')
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
                                                    {
                                                        sortState === 'az' ? 'A - Z' : sortState === 'za' ? 'Z - A' : 'Sort'
                                                    }
                                                </MenuButton>
                                                <MenuList bg="#0D1B2A" >
                                                    <MenuItem _focus={{ backgroundColor: '#152b43' }} onClick={() => handleSorting('az')}>A - Z</MenuItem>
                                                    <MenuItem _focus={{ backgroundColor: '#152b43' }} onClick={() => handleSorting('za')}>Z - A</MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </div>
                                    </div>
                                    {
                                        data &&
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
                        <Flex justifyContent="center">
                            <Flex color="white" h="75vh" alignItems="center" justifyContent="center" w="90%">
                                <Flex direction={['column', 'column', 'row', 'row']} alignItems="center" justifyContent="space-evenly" h="70%" w="90%" >
                                    <Flex h="100%" alignItems="center" justify="center" direction="column" >
                                        <Popover boundary="scrollParent" placement="top-start">
                                            <PopoverTrigger>
                                                <Image mb='10px' borderRadius="full" boxSize="150px" src={profilePic ? profilePic : `https://ui-avatars.com/api/?name=${supabase.auth.user().email}&length=1`} onError={() => setProfilePic('')}></Image>
                                            </PopoverTrigger>
                                            <PopoverContent borderRadius={10} bg="blackAlpha.700" border="none">
                                                <PopoverHeader fontWeight="bold">Information!</PopoverHeader>
                                                <PopoverBody>Currently uploading new avatar is not supported yet :(</PopoverBody>
                                            </PopoverContent>
                                        </Popover>
                                        {/* <Button onClick={() => inputFile.current.click()} m="10px" fontWeight="normal" colorScheme="blackAlpha" rightIcon={<AiOutlineCloudUpload size="20px" />}>
                                            Upload photo
                                        </Button>
                                        <input onChange={handleFileUpload} type="file" style={{ display: 'none' }} ref={inputFile}></input> */}
                                    </Flex>
                                    <Flex h="60%" w={['100%', '100%', '70%', '50%']} alignItems="center" justifyContent="space-between" direction="column">
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