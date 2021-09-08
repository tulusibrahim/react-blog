import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../configs/configurations';

const Topic = () => {
    const [session, setSession] = useState(false)
    const [dataTag, setDataTag] = useState([])
    let all = useLocation()
    let toast = useToast()

    const getDataTag = async () => {
        let result = await supabase.from('blog_tags').select('*', { count: 'planned' })

        result.error ? toast({ description: 'Failed to get data', status: 'error' }) : setDataTag(result.data)
    }

    useEffect(() => {
        setSession(supabase.auth.session())
        getDataTag()
    }, [all])
    //onClick={() => toast({ description: 'Still working on it!', status: 'info', isClosable: true })}
    return (
        <Flex w="100%" h="20vh" justify="center" >
            <Flex w={['95%', '95%', '95%', '95%']} h="100%" color="white" justify="center" direction="column" align="flex-start">
                {/* {
                session &&
                <div className="search">
                    <Link to="/new">
                        <button>Write New</button>
                    </Link>
                </div>
            } */}
                <Text fontSize="32px" fontWeight="bold">
                    Topics
                </Text>
                <Flex w="100%">
                    <Flex overflow="auto" className="category">
                        {
                            dataTag.map((res, index) => (
                                <Link to={{ pathname: `/topic/${(res.name).replace("#", '')}` }}>
                                    <Box _hover={{ bgColor: 'green.700' }} key={index} m="5px" bg="green.600" p="8px" borderRadius="50px">{(res.name).replace("#", '')}</Box>
                                </Link>
                            ))
                        }
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Topic;