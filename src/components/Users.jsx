import UserCard from './UserCard';

function Users({ pokemonData, filterCallback }) {
    const filteredList = filterCallback(pokemonData);

    return (
        <div className="pokemon-grid">
            {
                filteredList.map((item) => {
                    return <UserCard pokemon={item} key={item.id} />;
                })
            }
        </div>
    );
}

export default Users;
