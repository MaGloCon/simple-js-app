
Simple-JS-App

This is a simple Pokedex application that fetches data from an API, displays a list of Pokemon color-coded by type, allows user to view information about each Pokemon in a modal, and search for Pokemon by name.

1. Module Creation: The code starts by creating a module pokemonRepository using an Immediately Invoked Function Expression (IIFE). This module encapsulates a list of Pokemon (pokemonList) and functions to manipulate and interact with that list.

2. Adding Pokemon: The add function is used to add a Pokemon to the pokemonList. It checks if the Pokemon is an object and has the necessary properties before adding it to the list.

3. Getting All Pokemon: The getAll function returns all Pokemon in the pokemonList.

4. Loading the Pokemon List: The loadList function fetches a list of Pokemon from the PokeAPI. It maps the results to an array of objects and fetches the details of each Pokemon. It then creates a new object with the Pokemon's details and adds it to the pokemonList.

5. Loading Pokemon Details: The loadDetails function fetches detailed information about a specific Pokemon from the PokeAPI. It adds this detailed information to the Pokemon object.

6. Adding Pokemon to the List: The addListItem function creates a new list item for each Pokemon and adds it to the DOM. Each list item is a button that, when clicked, triggers the showDetails function.

7. Showing Pokemon Details: The showDetails function fetches detailed information about a specific Pokemon and displays it in a modal.

8. Showing the Modal: The showModal function populates a modal with the details of a specific Pokemon and displays it.

9. Search Bar: The searchBar function allows users to filter the list of Pokemon by name. It clears the Pokemon list and displays either a message if no Pokemon match the search value, or the filtered Pokemon.

10. Fetching and Loading the Pokemon List: After defining the pokemonRepository module, the code fetches the list of Pokemon from the PokeAPI, adds them to the pokemonList, and adds them to the DOM.

