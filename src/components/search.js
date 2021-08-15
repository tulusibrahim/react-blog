import { Link } from 'react-router-dom'
import { supabase } from '../configs/configurations';

const Search = () => {
    const session = supabase.auth.session()
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