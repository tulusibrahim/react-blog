import { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import { supabase } from '../configs/configurations'
import ShowMoreText from 'react-show-more-text';
import Masonry from 'react-masonry-css'


const Content = (props) => {
    const [data, setData] = useState([])
    let history = useHistory()

    const getData = async () => {
        window.location.reload()
        const { data, error } = await supabase.from('blog').select()
        setData(data)
    }

    useEffect(async () => {
        getData()
        // const { data, error } = await supabase
        //     .from('blog')
        //     .select(`
        //         *,
        //         blog_comments(
        //             author
        //         )
        //     `)
    }, [])

    return (
        <div>
            {
                data ?
                    <Masonry
                        className="cardcon"
                        breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
                    >
                        {
                            data.map((res, index) => (
                                <div className="card" key={index}>
                                    <Link className="title" to={{ pathname: `/article/${res.title}`, query: { res } }}>
                                        <div>{res.title}</div>
                                    </Link>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div className="date">{res.email}, &nbsp;</div>
                                        <div className="date">{res.date}</div>
                                    </div>
                                    <div className="body">
                                        <ShowMoreText
                                            /* Default options */
                                            lines={6}
                                            more='Show more'
                                            less='Show less'
                                            anchorClass='readMore'
                                            onClick={(res) => console.log(res)}
                                            expanded={false}
                                        >
                                            {res.body}
                                        </ShowMoreText>
                                    </div>
                                </div>
                            ))
                        }
                    </Masonry>
                    :
                    <div>No blogs :(</div>
            }
        </div>
    );
}

export default Content;