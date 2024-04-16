//IIFE to create a Pokemon repository
let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=200';
    
    // Add Pokemon to the list
    function add(pokemon) {
        if (
            typeof pokemon === 'object' &&
            'name' in pokemon &&
            'detailsURL' in pokemon &&
            'imageUrl' in pokemon
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

    // Add Pokemon to the list as a button
    function addListItem(pokemon) {
       let pokemonList = document.querySelector('.pokemon-list');
       let listPokemon = document.createElement('li');
       
       // Create a button element 
       let button = document.createElement('button');
       button.classList.add('pokemon-button');
       button.classList.add(pokemon.type);

       // Create an img element and set its src attribute to the Pokemon's image URL
        let img = document.createElement('img');
        img.src = pokemon.imageUrl;
        img.classList.add('pokemon-image');
        button.appendChild(img)

        // Create a text node for the Pokemon's name and append it to the button
        let textNode = document.createTextNode(pokemon.name);
        button.appendChild(textNode);
        
        // Append the button to the list item and the list item to the Pokemon list
        listPokemon.appendChild(button);
        pokemonList.appendChild(listPokemon);

        // Add an event listener to the button to show the Pokemon's details when clicked
       button.addEventListener('click', function(event) {
           showDetails(pokemon);
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

    // Show the Pokemon's details in a modal
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function(){
            showModal(pokemon);
        }); 
    }

    //Show modal when visible 
    function showModal(item) {
        let modalContainer = document.querySelector('#modal-container');

        //  Clear all existing modal content
        modalContainer.innerHTML = '';

        //  Create a new modal
        let modal = document.createElement('div');
        modal.classList.add('modal');

        // Set the background-color of modal based on the Pokemon's type
        if (item.types && item.types.length > 0) {
        let type = item.types[0].type.name; 
        if (type === 'normal' && item.types.length > 1) {
            type = item.types[1].type.name; 
        }
        modal.classList.add(type);
        }
        
        // Create a new div to hold the text elements
        let textContainer = document.createElement('div');
        textContainer.classList.add('text-container');

        // Add new modal content
        let closeButtonElement = document.createElement('button');
        closeButtonElement.classList.add('modal-close');
        closeButtonElement.innerText = 'X';
        closeButtonElement.addEventListener('click', hideModal);

        let titleElement = document.createElement('h1');
        titleElement.innerText = item.name.charAt(0).toUpperCase() + item.name.slice(1);

        let imgElement = document.createElement('img');
        imgElement.setAttribute('src', item.imgURL);

        let heightElement = document.createElement('p');
        heightElement.innerText = 'Height: ' + item.height + ' m';

        let weightElement = document.createElement('p');
        weightElement.innerText = 'Weight: ' + item.weight + ' kg';
        
        let typesElement = document.createElement('p');
        typesElement.innerText = 'Types: ' + item.types.map((type) => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(', ');
        
        let abilitiesElement = document.createElement('p');
        abilitiesElement.innerText = 'Abilities: ' + item.abilities.map((ability) => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)).join(', ');
        
        // Create an icon element to convert units
        let iconElement = document.createElement('img');
        iconElement.src = './img/ruler.svg';
        iconElement.className = 'ruler-icon';

        iconElement.addEventListener('click', function() {
            if (weightElement.innerText.includes('kg')) {
                // Convert kg to lbs (1 kg is approximately 2.20462 lbs)
                let weightInLbs = item.weight * 2.20462;
                weightElement.innerText = 'Weight: ' + weightInLbs.toFixed(2) + ' lbs';
        
                // Convert meters to feet (1 meter is approximately 3.28084 feet)
                let heightInFeet = item.height * 3.28084;
                heightElement.innerText = 'Height: ' + heightInFeet.toFixed(2) + ' ft';
            } else {
                // Convert back to metric units
                weightElement.innerText = 'Weight: ' + item.weight + ' kg';
                heightElement.innerText = 'Height: ' + item.height + ' m';
            }
        });

        // Create a tooltip element
        let tooltipElement = document.createElement('span');
        tooltipElement.className = 'tooltip';
        tooltipElement.innerText = 'Click to convert units';
        tooltipElement.style.display = 'none'; 
        iconElement.appendChild(tooltipElement);
        
        iconElement.addEventListener('mouseover', function() { // Show the tooltip when the mouse hovers over the image
            tooltipElement.style.display = 'inline';
        });

        iconElement.addEventListener('mouseout', function() { // Hide the tooltip when the mouse leaves the image
            tooltipElement.style.display = 'none';
        });

        // Append the elements to the textContainer
        textContainer.appendChild(titleElement);
        textContainer.appendChild(heightElement);
        textContainer.appendChild(weightElement);
        textContainer.appendChild(typesElement);
        textContainer.appendChild(abilitiesElement);
        textContainer.appendChild(iconElement);
        
        //Append modal content to the modal
        modal.appendChild(closeButtonElement);
        modal.appendChild(imgElement);
        modal.appendChild(textContainer); 

        modalContainer.appendChild(modal);

        //Add the modal to the page
        modalContainer.classList.add('is-visible');
    }

    // Hide modal when visible
    function hideModal() {
        let modalContainer = document.querySelector('#modal-container');
        modalContainer.classList.remove('is-visible');
    }

    // Hide modal when escape key is pressed
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideModal(); 
        }
    });

    // Hide modal when user clicks outside of modal
    let modalContainer = document.querySelector('#modal-container');
    modalContainer.addEventListener('click', (e) => {
        let target = e.target;
        if (target === modalContainer) {
            hideModal();
        }
    });

    // Search bar to filter Pokemon list by name
    function searchBar() {
        let searchBar = document.querySelector('#search-bar');
        
        searchBar.addEventListener('input', function() { 
            let searchValue = searchBar.value.toLowerCase();
            let filteredPokemon = pokemonList.filter(pokemon => pokemon.name.toLowerCase().startsWith(searchValue));
            
            // Clear the Pokemon list
            let pokemonListElement = document.querySelector('.pokemon-list');
            pokemonListElement.innerHTML = '';

            // Display a message if the search value does not match any Pokemon, otherwise display the filtered Pokemon
            if (filteredPokemon.length === 0) { 
                pokemonListElement.innerText = "\n\n\n\n\n\nCan't find the Pokemon you are looking for";
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

