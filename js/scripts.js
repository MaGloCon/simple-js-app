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
     }
    }

    function getAll() {
        return pokemonList;
    }

    function filterByName(name) {
        return pokemonList.filter(function(pokemon) {
            return pokemon.name === name;
        });
    }

    function addListItem(pokemon) {
        let pokemonList = document.querySelector('.pokemon-list');
        let li= document.createElement('li');
        pokemonList.appendChild(li);
        li.classList.add('pokemon-name-list');

        let button = document.createElement('button');
        button.innerText = pokemon.name;
        li.appendChild(button);

        button.classList.add('pokemon-name-button');

        addEventListener(button, pokemon);
    }

    function addEventListener(button, pokemon) {
        button.addEventListener('click', function() {
            showDetails(pokemon);
        });

        function showDetails(pokemon) {
            console.log(pokemon);
        }
    }
    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        filterByName: filterByName
    }
}) ();

pokemonRepository.add({name: 'Arcanine', height: 1.9, type: ['fire']});

// print Pokemon names and corresponding heights from pokemonList:
pokemonRepository.getAll().forEach(function(pokemon) {
   pokemonRepository.addListItem(pokemon);
});

let filterByName = pokemonRepository.filterByName('Bulbasaur');
console.log(filterByNameResult[0]);