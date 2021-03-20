import { Link } from 'react-router-dom'

const Search = () => {
    return (
        <div className="searchcon">
            <div className="search">
                <Link to="/new">
                    <button>Add New</button>
                </Link>
            </div>
        </div>
    );
}

export default Search;