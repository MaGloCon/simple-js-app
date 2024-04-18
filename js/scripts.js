//IIFE to create a Pokemon repository
let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=250';
    
    // Add Pokemon to the list
    function add(pokemon) {
        if (
            typeof pokemon === 'object' &&
            'name' in pokemon &&
            'detailsURL' in pokemon
        ) {
            pokemonList.push(pokemon);
        } else {
            console.error('Pokemon is not correct');
        }
    }

    // Get all Pokemon in the list
    function getAll() {
        return pokemonList;
    }

    // Load the Pokemon list from the API
    function loadList() {
        return fetch(apiUrl).then(function(response) { //fetch data from the API
            return response.json();
        }).then(function(json) {
            let promises = json.results.map(function(item) { //map the results to an array of objects and fetch the details of each Pokemon
                return fetch(item.url).then(function(response) {
                    return response.json();
                }).then(function(details) {
                    let pokemon = { //create a new object with the Pokemon's details
                        name: item.name,
                        detailsURL: item.url,
                        imageUrl: details.sprites.other.dream_world.front_default,
                        type: details.types[0].type.name, //for button color; set the type to the first type 
                    };
                    if (details.types.length > 1 && pokemon.type === 'normal') { //for button color: to set the type to the second type if the first type is normal
                        pokemon.type = details.types[1].type.name;
                    }
                    add(pokemon); 
                });
            });
            return Promise.all(promises); //return a promise that resolves when all the details have been fetched
        });
    }

    // Load the Pokemon details from the API
    function loadDetails(item) {
        let url = item.detailsURL;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            item.imgURL = details.sprites.other.dream_world.front_default; 
            item.height = details.height / 10; //convert height (decimeters) to meters
            item.weight = details.weight / 10; //convert weight (hectograms) to kilograms
            item.types = details.types;
            item.abilities = details.abilities;
        }).catch(function (e) {
            console.error(e);
        });
    }

    // Add Pokemon to the list as a button
    function addListItem(pokemon) {
        let pokemonList = document.querySelector('.list-group'); 
        
        // Create a list item element
        let listPokemon = document.createElement('li');
        listPokemon.classList.add('list-group-item');
        listPokemon.classList.add(pokemon.type); //add the type as a class to the list -- button color
        
        // Create a button element 
        let button = document.createElement('button');
        button.classList.add('pokemon-button', 'btn-block', 'btn-outline-light', 'text-dark');
        button.innerHTML = pokemon.name;
        
        // Append the button to the list item and the list item to the Pokemon list
        listPokemon.appendChild(button);
        pokemonList.appendChild(listPokemon);
    
        // Add an event listener to the button to show the Pokemon's details when clicked
        button.addEventListener('click', function(event) {
            showDetails(pokemon);
        });
    }

    // Show the Pokemon's details
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function(){
            showModal(pokemon);
        }); 
    }

    // Show the modal with the Pokemon's details
    function showModal(item) {
        let modalTitle = document.querySelector('#pokemonModalLabel');
        let modalImgContainer = document.querySelector('.image-background');
        let modalImg = document.querySelector('#pokemonImage', 'img');
        let modalHeight = document.querySelector('#pokemonHeight');
        let modalWeight = document.querySelector('#pokemonWeight');
        let modalTypes = document.querySelector('#pokemonTypes');
        let modalAbilities = document.querySelector('#pokemonAbilities');

        // Remove any existing type classes and add type class to image container
        modalImgContainer.className = 'image-background';
        modalImgContainer.classList.add( item.type);

        // Set the modal elements
        modalTitle.innerText = `${item.name.charAt(0).toUpperCase()}${item.name.slice(1)}`;
        modalImg.src = item.imgURL;
        modalImg.classList.add('modal-image', 'img-fluid', 'mx-auto', 'd-block', 'pb-3', 'pt-3'); 
        modalHeight.innerText = `Height: ${item.height} m`;
        modalHeight.classList.add('pt-3');
        modalWeight.innerText = `Weight: ${item.weight} kg`;
        modalTypes.innerText = `Types: ${item.types.map(type => `${type.type.name.charAt(0).toUpperCase()}${type.type.name.slice(1)}`).join(', ')}`;
        modalAbilities.innerText = `Abilities: ${item.abilities.map(ability => `${ability.ability.name.charAt(0).toUpperCase()}${ability.ability.name.slice(1)}`).join(', ')}`;

        // Show the modal
        let modal = new bootstrap.Modal(document.getElementById('pokemonModal'));
        modal.show();
        addCloseButtonEventListener(modal);
    }

    // Add event listener to close button on modal
    function addCloseButtonEventListener(modal) {
        let closeButton = document.querySelector('.btn-close');
        closeButton.classList.add('close-button');
        closeButton.addEventListener('click', function() {
            modal.hide();
        });
    }

    // Search icon and searchBar toggle
    let searchIcon = document.querySelector('#search-icon');
    let searchBarContainer = document.querySelector('#search-bar-container');
    searchIcon.addEventListener('click', function() {
        searchBarContainer.classList.toggle('d-none');
    });

    // Search bar to filter Pokemon list by name
    function searchBar() {
        let searchBar = document.querySelector('#search-bar');
        
        searchBar.addEventListener('input', function() { 
            let searchValue = searchBar.value.toLowerCase();
            let filteredPokemon = pokemonList.filter(pokemon => pokemon.name.toLowerCase().startsWith(searchValue));
            
            // Clear the Pokemon list
            let pokemonListElement = document.querySelector('.list-group');
            pokemonListElement.innerHTML = '';

            // Display a message if the search value does not match any Pokemon, otherwise display the filtered Pokemon
            if (filteredPokemon.length === 0) { 
                let message = "Can't find the Pokemon you are looking for";
                pokemonListElement.innerText = `\n\n\n\n\n\n${message}`;
            } else {
                filteredPokemon.forEach(pokemon => {
                    addListItem(pokemon);
                });
            }
        });
    }
    searchBar();
        
    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails,
    }
}) ();

//Fetch and Load Pokemon list
pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function(pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});

