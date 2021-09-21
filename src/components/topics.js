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
        <Flex w="100%" h="fit-content" mt="20px" direction="column" align="center" color="white">
            <Box w={['90%', '90%', '90%', "95%"]} mb="10px" mt="10px" textAlign="left">
                <Text fontSize="20px" fontWeight="bold" width="fit-content" borderRadius="50px" p="8px" bg="green.600">
                    {
                        param.topic
                    }
                </Text>
            </Box>
            <Flex w="100%" direction="row" wrap="wrap" justify="space-around">
                {
                    data.map((res, index) => (
                        res.isDraft !== 'true' &&
                        <Box key={index} p="10px" m="10px" w={['90%', '90%', '90%', "45%"]} className="card" borderRadius="5px" boxShadow="2px 2px 4px #060f18,-2px -2px 4px #152b43;">
                            <Link to={{ pathname: `/article/${res.title}` }}>
                                <Box fontSize="24px" color="rgb(184, 184, 184)" fontWeight="bold">{res.title}</Box>
                            </Link>
                            <Box color="grey">{res.date}</Box>
                            <Text noOfLines={4} color="#abacab">{(res.body).replace(/<[^>]*>/g, '')}</Text>
                        </Box>
                    ))
                }
            </Flex>
        </Flex>
    );
}

export default Topic;