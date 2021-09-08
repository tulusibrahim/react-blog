import { Image } from "@chakra-ui/image";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../configs/configurations";

const Friends = () => {
    let { user, friends } = useParams()
    const [followers, setFollowers] = useState([])
    let toast = useToast()

    const getFollowers = async (id) => {
        let getId = await supabase.from('blog_users').select().match({ nickname: user })
        if (getId.error) {
            toast({ description: 'Failed fetch data' })
        }
        else {
            let check = await supabase.from('blog_followers').select().eq('user_id', getId.data[0].id)
            console.log(check)
            if (check.data) {
                check.data.map(async res => {
                    let getfollower = await supabase.from('blog_users').select().eq('id', res.user_id)
                    console.log(getfollower)
                    if (getfollower.error) {
                        toast({ description: 'Failed to get follower' })
                    }
                    else {
                        followers ? setFollowers(old => [...old, getfollower.data[0]]) : setFollowers(getfollower.data[0])
                    }
                })
            }
        }
    }

    const getProfilePic = async (id) => {
        let photoUrl
        let photo = await supabase.storage.from("blog").download(`/profilePic/${id}`)
        console.log(photo)
        if (photo.data) {
            photoUrl = URL.createObjectURL(photo.data)
        }
        return photoUrl
    }

    useEffect(() => {
        setFollowers([])
        getFollowers()
    }, [])

    return (
        supabase.auth.session() == null ?
            <Center w="100%" h="90vh" color="white">
                <Box>Login to see {user} {friends}.</Box>
            </Center>
            :
            <Flex w="100%" h="90vh" color="white" align="center">
                <Flex w="80%" h="fit-content" justify="center">
                    {
                        followers.map((res, key) => (
                            <Box key={key} p="10px" m="10px" w={['90%', '90%', '90%', "45%"]} className="card" borderRadius="5px" boxShadow="2px 2px 4px #060f18,-2px -2px 4px #152b43;">
                                <Image src={`https://bbgnpwbarxehpmmnyfgq.supabase.in/storage/v1/object/public/blog/profilePic/${res.id}`} boxSize="30px" />
                                <Text>{res.nickname}</Text>
                                <Text>{res.bio}</Text>
                            </Box>
                        ))
                    }
                </Flex>
            </Flex>
    );
}

export default Friends;