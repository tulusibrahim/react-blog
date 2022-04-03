import { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import { supabase } from '../configs/configurations'
import parse from 'html-react-parser';
import Masonry from 'react-masonry-css'
import TextTruncate from 'react-text-truncate';
import Search from './search'
import { Box, Center, Flex } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import FollowedPeople from "./followedPeople";


const Home = (props) => {
    const [data, setData] = useState([])
    let history = useHistory()


    const getData = async () => {
        const { data, error } = await supabase.from('blog').select().eq('isDraft', 'false').order('date', { ascending: false })
        setData(data)
    }

    window.addEventListener("storage", () => {
        if (localStorage.getItem('supabase.auth.token')) {
            let itemm = localStorage.getItem('supabase.auth.token')
            console.log(itemm)
            // setNickName('')
            // getUsername()
            // getProfilePic()
        }
    })


    useEffect(async () => {
        document.title = "Home"
        if (localStorage.getItem('supabase.auth.token')) {
            let itemm = localStorage.getItem('supabase.auth.token')
            console.log(JSON.parse(itemm))
            // setNickName('')
            // getUsername()
            // getProfilePic()
        }
        getData()
    }, [])

    return (
        <Flex>
            <Box w={['100%', '100%', '75%', '80%']}>
                <Search />
                {
                    data ?
                        <Masonry
                            className="cardcon"
                            breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
                        >
                            {
                                data.map((res, index) => (
                                    < div className="card" key={index} >
                                        <Link className="title" to={{ pathname: `/article/${res.title}`, query: { res } }}>
                                            <div>{res.title}</div>
                                        </Link>
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div className="date">{(res.email).replace('@gmail.com', '').replace('@yahoo.com', '').replace('@hotmail.com', '').replace('@email.com', '')}, {res.date}</div>
                                        </div>
                                        <div className="body">
                                            <TextTruncate
                                                line={Math.floor(Math.random() * 5) + 1}
                                                element="span"
                                                truncateText="…"
                                                text={res.body.replace(/<[^>]*>/g, '')}
                                                textTruncateChild={<Link className="title" style={{ fontSize: 16, fontWeight: 'bold' }} to={{ pathname: `/article/${res.title}`, query: { res } }}>read more</Link>}
                                            />
                                        </div>
                                    </div>
                                ))
                            }
                        </Masonry>
                        :
                        <div>No blogs :(</div>
                }
            </Box>
            <Box w={['0%', '0%', '25%', '20%']} display={['none', 'none', 'block', 'block']} >
                <FollowedPeople />
            </Box>
        </Flex >
    );
}

export default Home;