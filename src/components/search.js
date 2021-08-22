import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../configs/configurations';

const Search = () => {
    const [session, setSession] = useState(false)
    let all = useLocation()

    useEffect(() => {
        setSession(supabase.auth.session())
        // console.log(all)
    }, [all])
    return (
        <div className="searchcon">
            {
                session &&
                <div className="search">
                    <Link to="/new">
                        <button>Write New</button>
                    </Link>
                </div>
            }
        </div>
    );
}

export default Search;