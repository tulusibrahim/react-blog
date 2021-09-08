import { Image } from '@chakra-ui/image';
import { Box, Center, Flex, Text } from '@chakra-ui/layout';
import { Button, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { supabase } from '../configs/configurations';

const Profile = (props) => {
    let { user } = useParams()
    const [profile, setProfile] = useState([])
    const [data, setData] = useState([])
    const [profilePic, setProfilePic] = useState('')
    const [savedId, setSavedId] = useState('')
    const [followState, setFollowState] = useState('')
    const [followers, setFollowers] = useState(0)
    const [following, setFollowing] = useState(0)
    const [showBtnFollow, setShowBtnFollow] = useState(true)
    let toast = useToast()

    const getProfile = async () => {
        let profile = await supabase.from('blog_users').select("*,blog(*)").match({ nickname: user })
        console.log(profile)
        setProfile(profile.data[0])
        // setData(profile.data[0].blog)
        setSavedId(profile.data[0].id)
        getProfilePic(profile.data[0].id)
        getFollowers(profile.data[0].id)
        getFollowing(profile.data[0].id)

        let filteredArray = profile.data[0].blog.filter(res => res.isDraft !== 'true')
        console.log(filteredArray)
        setData(filteredArray)

        if (supabase.auth.session()) {
            isFollow(profile.data[0].id)
            if (supabase.auth.user().id == profile.data[0].id) {
                setShowBtnFollow(false)
            }
        }
        else {
            setShowBtnFollow(false)
        }
    }

    const getData = async () => {
        let result = await supabase.from('blog').select("*").match({ authorUserId: `${savedId}`, isDraft: 'false' })
        console.log(result)
        if (result.data) {
            setData(result.data[0].blog)
        }
    }

    const getProfilePic = async (id) => {
        // console.log(id)
        let profilePic = await supabase.storage.from('blog').download(`profilePic/${id}`)
        if (profilePic.data) {
            let image = URL.createObjectURL(profilePic.data)
            setProfilePic(image)
        }
    }

    const getFollowers = async (id) => {
        let check = await supabase.from('blog_followers').select().eq('user_id', id)
        console.log(check)
        if (check.data) {
            setFollowers(check.data.length)
        }
    }

    const getFollowing = async (id) => {
        let check = await supabase.from('blog_followers').select().eq('follower_id', id)
        console.log(check)
        if (check.data) {
            setFollowing(check.data.length)
        }
    }

    const isFollow = async (userId) => {
        const check = await supabase.from('blog_followers').select().match({ user_id: userId, follower_id: supabase.auth.user().id })
        console.log(check)
        if (check.data.length) {
            setFollowState('Followed')
        }
        else {
            setFollowState('Follow')
        }
    }

    const followUnfollowUser = async () => {
        if (!supabase.auth.session()) {
            toast({ description: 'Log in first to follow ' + profile.nickname, status: 'info' })
        }
        else {
            if (followState == 'Followed') {
                let unfollow = await supabase.from('blog_followers').delete().match({ user_id: profile.id, follower_id: supabase.auth.user().id })

                if (unfollow.data.length) {
                    setFollowState('Follow')
                }
                else if (unfollow.error) {
                    toast({ description: 'Failed to unfollow, pleas try again', status: 'warning' })
                }
                getFollowers(savedId)
            }
            else {
                let follow = await supabase.from('blog_followers').insert({ user_id: profile.id, follower_id: supabase.auth.user().id })

                if (follow.data.length) {
                    setFollowState('Followed')
                }
                else if (follow.error) {
                    toast({ description: 'Failed to follow, pleas try again', status: 'warning' })
                }
                getFollowers(savedId)
            }
        }
    }

    // useEffect(() => {
    //     document.title = user
    //     if (supabase.auth.session()) {
    //         // console.log(props)
    //         setSavedId('')
    //         setProfilePic('')
    //         getProfile()
    //         // getData()
    //     }
    // }, [])

    useEffect(async () => {
        document.title = user
        // console.log(props)
        setSavedId('')
        setProfilePic('')
        setShowBtnFollow(true)
        getProfile()
        setFollowState('')
        // let result = await supabase.from('blog_followers').delete().match({ user_id: 'ba2475e1-f5e3-45e7-b330-c5feddef40c1', follower_id: 'ba2475e1-f5e3-45e7-b330-c5feddef40c1' })
        // getData()
    }, [user])

    return (
        <Flex w="100%" h="100%" mt="20px" justify="center" color="white" >
            <Flex align="center" justify="space-evenly" w="95%" h="fit-content" mb="20px" direction="column">
                <Flex align="center" w="100%" justify="space-evenly" direction={['row', 'row', 'column', 'column']} mb="20px">
                    <Image boxSize={["60px", "70px", "90px", "120px"]} borderRadius="50%" src={profilePic ? profilePic : `https://ui-avatars.com/api/?name=${profile.nickname}&length=1`} />
                    <Flex align={["flex-start", "flex-start", "center", "center"]} direction="column">
                        <Text fontSize={["20px", "24px", "24px", "28px"]} ml="5px" wordBreak="break-all">{profile.nickname}</Text>
                        <Text fontStyle="italic" fontSize={["12px", "16px", "18px", "20px"]} ml="5px">{profile.bio}</Text>
                        <Flex>
                            <Link to={{ pathname: `/${profile.nickname}/following` }}>
                                <Text ml="5px" fontSize={["12px", "16px", "18px", "20px"]}>{following} Following • </Text>
                            </Link>
                            <Link to={{ pathname: `/${profile.nickname}/followers` }}>
                                <Text ml="5px" fontSize={["12px", "16px", "18px", "20px"]}>{followers} Followers</Text>
                            </Link>
                        </Flex>
                        {
                            showBtnFollow &&
                            <Button colorScheme="messenger" p={['10px', '12px', '14px', '16px']} borderRadius="5px" ml="5px" mt="10px" onClick={followUnfollowUser}>{followState}</Button>
                        }
                    </Flex>
                </Flex>
                <Flex direction="column" align="center" w="100%">
                    {
                        data == '' ?
                            <Center color="white" h="50px" w="100%">No post from {user}.</Center>
                            :
                            data.map(res => (
                                // res.isDraft !== 'true' ?
                                < Box w={["95%", "95%", "75%", "70%"]} p="10px" mt="5px" mb="5px" borderRadius=".5rem" border="1px #161f30 solid" _hover={{ boxShadow: '0px 0px 5px #305a88' }} boxShadow="2px 2px 4px #060f18, -2px -2px 4px #152b43">
                                    <Link to={{ pathname: `/article/${res.title}`, query: { res } }}>
                                        <Text fontSize={["16px", "16px", "18px", "20px"]}>{res.title}</Text>
                                    </Link>
                                    <Text fontSize={["10px", "10px", "12px", "12px"]} color="#716F81">{res.date}</Text>
                                    <Text noOfLines={3} fontSize={["14px", "14px", "16px", "16px"]} color="#C8C6C6">{res.body.replace(/<[^>]*>/g, '')}</Text>
                                    <Box>
                                        <Text fontSize={["14px", "14px", "16px", "16px"]}>❤&nbsp; {res.likes ? res.likes : '0'} </Text>
                                    </Box>
                                </Box>
                            ))

                    }
                </Flex>
            </Flex>
        </Flex >
    );
}

export default Profile;