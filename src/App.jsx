import { useState, useEffect } from 'react';
import Users from './components/Users';
import './index.css';

function App() {
    const [pokemonArray, setPokemonArray] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [singleResult, setSingleResult] = useState(null);
    const [isNotFound, setIsNotFound] = useState(false);
    const [filterSmall, setFilterSmall] = useState(false);


    useEffect(() => {
        const loadPokemon = async () => {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
            const apiData = await response.json();

            const promiseArr = apiData.results.map(async (pokemon) => {
                const detailRes = await fetch(pokemon.url);
                return detailRes.json();
            });

            const fullData = await Promise.all(promiseArr);
            setPokemonArray(fullData);
        };

        loadPokemon();
    }, []);


    function filterHandler(list) {
        if(filterSmall){
            return list.filter(p => p.height < 8);
        }
        return list;
    }


    async function searchHandler() {
        setIsNotFound(false);
        setSingleResult(null);

        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchInput.toLowerCase()}`);
            if(!res.ok){
                throw new Error('not found');
            }
            const resultData = await res.json();
            setSingleResult(resultData);
        } catch (err) {
            setIsNotFound(true);
        }
    }


    return (
        <div className="container">
            <h1>Pokemon Finder</h1>

            <button onClick={() => setFilterSmall(!filterSmall)}>
                { filterSmall ? "Show All Pokemon" : "Show Short Pokemon Only" }
            </button>

            <Users pokemonData={pokemonArray} filterCallback={filterHandler}/>


            <div className="search-section">
                <h2>Search For Pokemon</h2>

                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="enter pokemon name"
                />

                <button onClick={searchHandler}>Search</button>

                { isNotFound && <p className="error-message">Not found!</p> }

                { singleResult && (
                    <div className="search-card">
                        <img src={singleResult.sprites.front_default} alt={singleResult.name}/>
                        <h4>{singleResult.name}</h4>
                        <p>Height: {singleResult.height}</p>
                        <p>Weight: {singleResult.weight}</p>
                    </div>
                )}
            </div>

        </div>
    );
}

export default App;