import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../configs/configurations';

const Topic = () => {
    let param = useParams()
    const [data, setData] = useState([])

    const getData = async () => {
        let result = await supabase.from('blog_tags').select('*,blog(*)').eq('name', `#${param.topic}`)
        let removeDuplicateValue = Object.values(result.data[0].blog.reduce((acc, current) => Object.assign(acc, { [current.id]: current }), {}))
        setData(removeDuplicateValue)
    }

    useEffect(() => {
        setData([])
        getData()
        document.title = `Topic - ${(param.topic).replace('#', '')}`
    }, [])

    return (
        <Flex w="100%" h="fit-content" mt="10vh" justify="center" color="white">
            <Flex w="90%" direction="row" wrap="wrap" justify="space-around">
                {
                    data.map(res => (
                        res.isDraft !== 'true' &&
                        <Box p="10px" m="10px" w={['100%', '100%', '100%', "45%"]} className="card" borderRadius="5px" boxShadow="2px 2px 4px #060f18,-2px -2px 4px #152b43;">
                            <Link to={{ pathname: `/article/${res.title}` }}>
                                <Box fontSize="24px">{res.title}</Box>
                            </Link>
                            <Box color="grey">{res.date}</Box>
                            <Text noOfLines={4} color="GrayText">{(res.body).replace(/<[^>]*>/g, '')}</Text>
                        </Box>
                    ))
                }
            </Flex>
        </Flex>
    );
}

export default Topic;