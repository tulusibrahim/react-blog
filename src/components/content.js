import { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import { supabase } from '../configs/configurations'
import ShowMoreText from 'react-show-more-text';
import Masonry from 'react-masonry-css'
import { Editor, CompositeDecorator, EditorState, convertFromRaw } from "draft-js";


const Content = (props) => {
    const [data, setData] = useState([])
    let history = useHistory()

    const getData = async () => {
        const { data, error } = await supabase.from('blog').select()
        setData(data)
        // res.title === 'coba terakhir semoga pake draftjs' &&
        console.log(data)
        data.map(res => {
            let jnk = JSON.stringify(res.body)
            console.log(jnk)
            res.title === 'coba terakhir semoga pake draftjs' &&
                // let kk = convertFromRaw(jnk)
                // console.log(kk)
                console.log(convertFromRaw(JSON.parse(res.body)).getPlainText())
        })
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
                                            {convertFromRaw(JSON.parse(res.body)).getPlainText()}
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