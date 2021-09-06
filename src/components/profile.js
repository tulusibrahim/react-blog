import { Image } from '@chakra-ui/image';
import { Box, Flex, Text } from '@chakra-ui/layout';
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

    const getProfile = async () => {
        let profile = await supabase.from('blog_users').select("*,blog(*)").match({ nickname: user })
        console.log(profile)
        setProfile(profile.data[0])
        setData(profile.data[0].blog)
        setSavedId(profile.data[0].id)
        getProfilePic(profile.data[0].id)
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

    useEffect(() => {
        document.title = user
        if (supabase.auth.session()) {
            // console.log(props)
            setSavedId('')
            setProfilePic('')
            getProfile()
            // getData()
        }
    }, [])

    return (
        <Flex w="100%" h="100%" mt="20px" justify="center" color="white">
            <Flex align="center" justify="space-evenly" w="95%" h="fit-content" direction="column">
                <Flex align="center" w="100%" justify="space-evenly" direction={['row', 'row', 'column', 'column']} mb="20px">
                    <Image boxSize={["50px", "60px", "80px", "100px"]} borderRadius="50px" src={profilePic ? profilePic : `https://ui-avatars.com/api/?name=${supabase.auth.user().email}&length=1`} />
                    <Flex align={["flex-start", "flex-start", "center", "center"]} direction="column">
                        <Text fontSize={["20px", "24px", "24px", "28px"]} ml="5px" wordBreak="break-all">{profile.nickname}</Text>
                        <Text fontStyle="italic" fontSize={["12px", "16px", "18px", "20px"]} ml="5px">{profile.bio}</Text>
                    </Flex>
                </Flex>
                <Flex direction="column" align="center" w="100%">
                    {
                        data.map(res => (
                            res.isDraft !== 'true' &&
                            < Box w={["95%", "85%", "75%", "70%"]} p="10px" mt="5px" mb="5px" borderRadius=".5rem" border="1px #161f30 solid" _hover={{ boxShadow: '0px 0px 5px #305a88' }} boxShadow="2px 2px 4px #060f18, -2px -2px 4px #152b43">
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