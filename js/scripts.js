//IIFE to create a Pokemon repository
let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';
    
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

        //Clear all existing modal content
        modalContainer.innerHTML = '';

        //Create a new modal
        let modal = document.createElement('div');
        modal.classList.add('modal');
        
        //Add new modal content
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
        
        //Toggle switch to convert height and weight between metric and imperial units
        let toggleSwitch = document.createElement('label');
        toggleSwitch.classList.add('switch');

        let inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'checkbox');
        inputElement.addEventListener('change', function() {
            if (this.checked) {
                let [height, weight] = toImperial(item.height, item.weight);
                heightElement.innerText = 'Height: ' + height + ' ft';
                weightElement.innerText = 'Weight: ' + weight + ' lbs';
            } else {
                let [height, weight] = toMetric(item.height, item.weight);
                heightElement.innerText = 'Height: ' + height + ' m';
                weightElement.innerText = 'Weight: ' + weight + ' kg';
            }
        });

        let sliderElement = document.createElement('span');
        sliderElement.classList.add('slider', 'round');

        let imperialElement = document.createElement('span');
        imperialElement.innerText = 'Imperial';
        imperialElement.style.float = 'left';
        
        let metricElement = document.createElement('span');
        metricElement.innerText = 'Metric';
        metricElement.style.float = 'right';

        sliderElement.appendChild(imperialElement);
        sliderElement.appendChild(metricElement);

        toggleSwitch.appendChild(inputElement);
        toggleSwitch.appendChild(sliderElement);
        toggleSwitch.appendChild(imperialElement);
        toggleSwitch.appendChild(inputElement);
        toggleSwitch.appendChild(sliderElement);
        toggleSwitch.appendChild(metricElement);
        
        //Append modal content to the modal
        modal.appendChild(closeButtonElement);
        modal.appendChild(imgElement);
        modal.appendChild(titleElement);
        modal.appendChild(heightElement);
        modal.appendChild(weightElement);
        modal.appendChild(typesElement);
        modal.appendChild(abilitiesElement);
        modal.appendChild(toggleSwitch);

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

    function toImperial(height, weight) {
        // Convert height from meters to feet and weight from kilograms to pounds
        let heightInFeet = height * 3.28084;
        let weightInPounds = weight * 2.20462;
        return [heightInFeet.toFixed(2), weightInPounds.toFixed(2)];
    }
    
    function toMetric(height, weight) {
        // Convert height from feet to meters and weight from pounds to kilograms
        let heightInMeters = height / 3.28084;
        let weightInKilograms = weight / 2.20462;
        return [heightInMeters.toFixed(2), weightInKilograms.toFixed(2)];
    }
    // Search bar to filter Pokemon list by name
    let searchBar = document.querySelector('#search-bar');

    searchBar.addEventListener('input', function() { 
        // Get the value of the search bar and convert it to lowercase
        let searchValue = searchBar.value.toLowerCase();
    
        // Filter the Pokemon list based on the search value
        let filteredPokemon = pokemonList.filter(pokemon => pokemon.name.toLowerCase().startsWith(searchValue)); //
    
        // Clear the current list
        let pokemonListElement = document.querySelector('.pokemon-list');
        pokemonListElement.innerHTML = '';
    
        // Add the filtered Pokemon to the list 
        filteredPokemon.forEach(pokemon => {
            addListItem(pokemon);
        });
    });

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