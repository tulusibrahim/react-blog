import { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import { supabase } from '../configs/configurations'
import parse from 'html-react-parser';
import Masonry from 'react-masonry-css'
import TextTruncate from 'react-text-truncate';


const Content = (props) => {
    const [data, setData] = useState([])
    let history = useHistory()

    const getData = async () => {
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
                                < div className="card" key={index} >
                                    <Link className="title" to={{ pathname: `/article/${res.title}`, query: { res } }}>
                                        <div>{res.title}</div>
                                    </Link>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div className="date">{res.email}, &nbsp;</div>
                                        <div className="date">{res.date}</div>
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
        </div >
    );
}

export default Content;