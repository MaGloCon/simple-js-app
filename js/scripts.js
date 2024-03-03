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
        if (
            typeof pokemon === 'object' &&
            'name' in pokemon &&
            'detailsURL' in pokemon
        ) {
            pokemonList.push(pokemon);
        } else {
            console.log('Pokemon is not correct');
        }
    }

    function addListItem(pokemon) {
       let pokemonList = document.querySelector('.pokemon-list');
       let listPokemon = document.createElement('li');
       let button = document.createElement('button');
       button.innerText = pokemon.name;
       button.classList.add('button-class');
       listPokemon.appendChild(button);
       pokemonList.appendChild(listPokemon);
       button.addEventListener('click', function(event) {
           showDetails(pokemon);
       });
    }


    function loadList() {
        showLoadingMessage();
        return fetch(apiUrl).then(function(response) {
            return response.json();
        }).then(function(json) {
            hideLoadingMessage();
            json.results.forEach(function(item) {
                let pokemon = {
                    name: item.name,
                    detailsURL: item.url
                };
                add(pokemon);
            });
        }).catch(function (e) {
            hideLoadingMessage();
            console.error(e);
        });
    }

    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            // adds details to item
            item.imgUrl = details.sprites.front_default; //change to home front_default later
            item.height = details.height;
            item.types = details.types; // add a for loop to iterate trough each type!!!
        }).catch(function (e) {
            console.error(e);
        });
    }

    function showDetails(pokemon) {
        loadDetails(pokemon).then(function(){
            console.log(pokemon);
        }); 
    }

    function getAll() {
        return pokemonList;
    }

    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails
    }
}) ();

pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function(pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});

function showLoadingMessage() {
    document.getElementById('loadingMessage');
}

function hideLoadingMessage() {
    document.getElementById('loadingMessage');
}
