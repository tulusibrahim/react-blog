import { Image } from '@chakra-ui/image';
import { Box, Center, Flex, Text } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../configs/configurations';


const FollowedPeople = () => {
    const [followers, setFollowers] = useState([])
    let toast = useToast()

    const getFollowers = async (id) => {
        let getId = await supabase.from('blog_users').select().match({ id: supabase.auth.user().id })
        if (getId.error) {
            toast({ description: 'Failed fetch data' })
            return
        }
        else {
            let check = await supabase.from('blog_followers').select().eq('follower_id', getId.data[0].id)
            // console.log(check)
            if (check.data) {
                check.data.map(async res => {
                    let getfollower = await supabase.from('blog_users').select().eq('id', res.user_id)
                    // console.log(getfollower)
                    if (getfollower.error) {
                        toast({ description: 'Failed to get follower' })
                    }
                    else {
                        // followers ? setFollowers(old => [...old, getfollower.data]) : setFollowers(getfollower.data)
                        setFollowers(getfollower.data)
                    }
                })
            }
        }
        // setFollowers()
    }

    useEffect(() => {
        setFollowers([])
        if (supabase.auth.session()) {
            getFollowers()
        }
    }, [])
    //bg="#152b43"


    return (
        <Center color="white" d="flex" flexDirection="column">
            <Box py="20px" w="100%" fontSize="24px" fontWeight="bold">
                People
            </Box>
            <Box w="100%" >
                {
                    supabase.auth.session() == null ?
                        <Center >Login to see followed people.</Center>
                        :
                        <Flex w="100%" justify="center">
                            {
                                followers == '' ?
                                    <Box color="white" fontStyle="italic">
                                        No people followed so far.
                                    </Box>
                                    :
                                    followers.map((res, key) => (
                                        <Link to={{ pathname: `/${res.nickname}` }} style={{ width: '95%' }}>
                                            <Flex key={key} p="10px" borderRadius="5px" bg="#152b43" align="center"  >
                                                <Image src={`https://bbgnpwbarxehpmmnyfgq.supabase.in/storage/v1/object/public/blog/profilePic/${res.id}` ?
                                                    `https://bbgnpwbarxehpmmnyfgq.supabase.in/storage/v1/object/public/blog/profilePic/${res.id}`
                                                    :
                                                    `https://ui-avatars.com/api/?name=${res.nickname}&length=1`}
                                                    boxSize="50px"
                                                    borderRadius="50%"
                                                    mr="10px"
                                                />
                                                <Text>{res.nickname}</Text>
                                            </Flex>
                                        </Link>
                                    ))
                            }
                        </Flex>
                }
            </Box>
        </Center>
    )
}

export default FollowedPeople