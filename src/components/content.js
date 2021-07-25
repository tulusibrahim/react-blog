import { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import { supabase } from '../configs/configurations'
import ShowMoreText from 'react-show-more-text';


const Content = (props) => {
    const [data, setData] = useState([])
    let history = useHistory()

    const getData = async () => {
        const { data, error } = await supabase.from('blog').select()
        setData(data)
    }

    useEffect(async () => {
        if (window.screen.width < 992) {
            history.push("/notresponsive")
        }
        else {
            getData()
        }
        // axios.post('http://localhost:3100/deleteksong')
        //     .then(res => console.log(res))
    }, [])

    const certainContent = (res) => {
        props.getdata(res)
    }

    return (
        <div className="cardcon">
            {
                data ?
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
                    :
                    <div>No blogs :(</div>
            }
        </div>
    );
}

export default Content;