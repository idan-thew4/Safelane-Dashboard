import { useState } from "react";
import { useStore } from "../../../Context/Store";



const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { getChecked, setMarkSearchResults } = useStore();





    return (

        <form role="search" onSubmit={(e) => getChecked(searchQuery, 'search', e)}>
            <input
                className="filter parag_16 light"
                // required type="search"
                placeholder="מס’ דיווח, מס’ רכב ,סוג עבירה או טקסט חופשי "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="search__buttons">
            <button 
            className={`search__clear ${searchQuery === '' ? '' : 'show'}`}
            onClick={() => setSearchQuery('')}
            ></button>
            <div className={`search__separator ${searchQuery === '' ? '' : 'show'}`}></div>

            <button
                className={`search__submit ${searchQuery === '' ? 'disbaled' : ''}`}
                onClick={() => setMarkSearchResults(false)}
            >
            </button>
            </div>

        </form>

    )


}

export default Search
