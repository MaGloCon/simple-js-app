//IIFE to create a Pokemon repository
let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
    let offset = 0; // Start at the beginning
    let limit = 50; // Fetch 50 Pokemon at a time
    
    // Capitalize the first letter of a string
    function capitalizeFirstLetter(string) { 
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    
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
    async function loadList() {
        const response = await fetch(`${apiUrl}?offset=${offset}&limit=${limit}`);
        const json = await response.json();
        let promises = json.results.map(function (item) {
            return fetch(item.url).then(function (response_1) {
                return response_1.json();
            }).then(function (details) {
                let pokemon = {
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
        return await Promise.all(promises);
    }

    // Load the Pokemon details from the API -- 
    async function loadDetails(item) { 
        let url = item.detailsURL;
        try {
            const response = await fetch(url);
            const details = await response.json();
            item.imgURL = details.sprites.other.dream_world.front_default;
            item.height = details.height / 10; //convert height (decimeters) to meters
            item.weight = details.weight / 10; //convert weight (hectograms) to kilograms
            item.types = details.types;
            item.abilities = details.abilities;
        } catch (e) {
            console.error(e);
        }
    }

    // Show the Pokemon's details in the modal
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function(){
            showModal(pokemon);
        }); 
    }

    // Add Pokemon to the list as a button
    function addListItem(pokemon) {
        // Create a list item element
        let listPokemon = $('<div>').addClass('pokemon-div col-9 col-md-4 col-lg-3 border m-1 rounded-lg ' + pokemon.type);
    
        // Create a button element 
        let button = $('<button>').addClass('pokemon-button btn d-flex justify-content-between align-items-center')
                                  .attr('data-toggle', 'modal')
                                  .attr('data-target', '#pokemonModal');
    
        // Create an image element
        let image = $('<img>').attr('src', pokemon.imageUrl)
                              .attr('alt', `Image of ${pokemon.name}`)
                              .addClass('pokemon-image img-fluid');
        button.append(image);
    
        // Create textNode for pokemon name; span element for styling 
        let span = $('<span>').addClass('text-white').text(capitalizeFirstLetter(pokemon.name));
        button.append(span);
    
        // Append the button to the list item and the list item to the Pokemon list
        listPokemon.append(button);
        $('.row').append(listPokemon)
                 .addClass('justify-content-center');
        
        // Add a delay in showing the Pokemon list for smoother loading and better user experience
        setTimeout(() => listPokemon.addClass('visible'), 100);
        
        // Show Pokemon's details when Pokemon button is clicked
        button.click(function() {
            showDetails(pokemon);
        });
    }

    // Show the modal with the Pokemon's details
    function showModal(item) {
        $('.image-background').attr('class', 'image-background').addClass(item.type); 
    
        // Set the modal elements
        $('#pokemonModalTitle').text(capitalizeFirstLetter(item.name));        
        $('#pokemonModalImage').attr('src', item.imgURL).addClass('modal-image img-fluid');
        $('#pokemonModalHeight').text(`Height: ${item.height} m`).addClass('pt-3');
        $('#pokemonModalWeight').text(`Weight: ${item.weight} kg`);
        $('#pokemonModalTypes').text(`Types: ${item.types.map(type => capitalizeFirstLetter(type.type.name)).join(', ')}`);
        $('#pokemonModalAbilities').text(`Abilities: ${item.abilities.map(ability => capitalizeFirstLetter(ability.ability.name)).join(', ')}`);
    }

    // Search bar to filter Pokemon list by name
    function searchBar() {
        let $searchBar = $('#search-bar');

        $searchBar.on('input', function() {
            let searchValue = $searchBar.val().toLowerCase(); 
            let filteredPokemon = pokemonList.filter(pokemon => pokemon.name.toLowerCase().startsWith(searchValue)); 

            // Clear the Pokemon list
            let $pokemonListElement = $('.row');
            $pokemonListElement.empty();

            // Display a message if the search value does not match any Pokemon, otherwise display the filtered Pokemon
            if (filteredPokemon.length === 0) {
                let message = "Can't find the Pokemon you are looking for";
                $pokemonListElement.text(`\n\n\n\n\n\n${message}`);
            } else {
                filteredPokemon.forEach(pokemon => {
                    addListItem(pokemon);
                });
            }
        });
    }
    searchBar(); 

    // Search icon and searchBar toggle
    let searchIcon = document.querySelector('#search-icon');
    let searchBarContainer = document.querySelector('#search-bar-container');
    searchIcon.addEventListener('click', function() {
        searchBarContainer.classList.toggle('d-none');
    });

    // Load more Pokemon when the user scrolls to the bottom of the page
    $(window).on('scroll', function() {
        if ($(window).innerHeight() + $(window).scrollTop() >= $(document).height()) { // If the user has scrolled to the bottom of the page
            offset += limit;  // Increase the offset by the limit
            loadList().then(function() { //
                pokemonRepository.getAll().slice(-limit).forEach(function(pokemon) { 
                    pokemonRepository.addListItem(pokemon); //
                });
            });
        }
    });

    
    // Scroll to top button
    let $mybutton = $("#scrollToTopButton");

    // When the user scrolls down 20px from the top of the document, show the button
    $(window).scroll(function() {
        if ($(window).scrollTop() > 20) {
            $mybutton.show();
        } else {
            $mybutton.hide();
        }
    });

    // When the user clicks on the button, scroll to the top of the document
    $mybutton.click(function() {
        $('html, body').animate({scrollTop: 0}, 'slow');
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

