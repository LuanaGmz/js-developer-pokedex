
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar detalhes do Pokémon ${pokemon.name}`);
            }
            return response.json();
        })
        .then(convertPokeApiDetailToPokemon)
        .catch((error) => {
            console.error('Erro ao obter detalhes do Pokémon:', error);
            throw error;
        });
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Erro ao buscar pokémons');
            }
            return response.json();
        })
        .then((jsonBody) => {
            const pokemons = jsonBody.results;
            if (pokemons.length === 0) {
                throw new Error('Nenhum pokémon encontrado');
            }
            return pokemons;
        })
        .then((pokemons) => {
            const detailRequests = pokemons.map(pokeApi.getPokemonDetail);
            return Promise.all(detailRequests);
        })
        .then((pokemonsDetails) => pokemonsDetails)
        .catch((error) => {
            console.error('Erro:', error);
            return [];
        });
};
