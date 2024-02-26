//Height in meters (m)
let pokemonRepository = (function () {
    let pokemonList = [
        {
            name: 'Bulbasaur', 
            height: 0.7, 
            type: ['grass', 'poison']
        },
        {
            name: 'Ivysaur', 
            height: 1.0, 
            type: ['grass', 'poison']
        },
        {
            name: 'Venusaur', 
            height: 2.0, 
            type: ['grass', 'poison']
        },
        {
            name: 'Charmander', 
            height: 0.6, 
            type: ['fire']
        },
        {
            name: 'Charmeleon', 
            height: 1.1, 
            type: ['fire']
        },
        {
            name: 'Charizard', 
            height: 1.7, 
            type:['fire']
        },
        {
            name: 'Pikachu', 
            height: 0.4, 
            type: ['electric']
        },
        {
            name: 'Raichu', 
            height: 0.8, 
            type: ['electric']
        },
        {
            name: 'Squirtle', 
            height: 0.5, 
            type: ['water']
        },
        {
            name: 'Wartortle', 
            height: 1.0, 
            type: ['water']
        },
        {
            name: 'Blastoise', 
            height: 1.6, 
            type: ['water']
        },
        {
            name: 'Clefairy', 
            height: 0.6, 
            type: ['fairy']
        },
        {
            name: 'Clefable', 
            height: 1.3, 
            type: ['fairy']
        }
];

function add(pokemon) {
    if (typeof pokemon === 'object') {
        pokemonList.push(pokemon);
    } else {
        console.log('pokemon is not correct');
    }
}
function getAll() {
    return pokemonList;
}

return {
    add: add,
    getAll: getAll
};
}) ();

pokemonRepository.add({name: 'Arcanine', height: 1.9, type: ['fire']});

/* print Pokemon names and corresponding heights from pokemonList:
   // print name and height with message if the height is less than to 0.6 m
   // print name and height with message if the height is more than to 1.2 m
   // otherwise print only name and height */
pokemonRepository.getAll().forEach(function(pokemon) {
    if (pokemon.height < 0.6) { 
        document.write('<p>' + pokemon.name + ' (height: ' + pokemon.height + ' m)' + ' - Small, but mighty! </p>');
    } else if (pokemon.height > 1.2) {
        document.write('<p>' + pokemon.name + ' (height: ' + pokemon.height + ' m)' + ' - Wow, that\'s a big one! </p>');
    } else {
        document.write('<p>' + pokemon.name + ' (height: ' + pokemon.height + ' m)' + ' </p>');
    }
});