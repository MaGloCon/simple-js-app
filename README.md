# Simple JS App - Pokedex

This project is a web-based Pokedex application that fetches data from the PokeAPI. It displays a list of Pokemon color-code by type with their images, and allows users to view more details about each Pokemon in a modal.

## Features

- **Pokemon Repository:** A local repository is maintained to store the details of each Pokemon fetched from the PokeAPI.
- **Infinite Scroll Pagination:** The application fetches and displays 50 Pokemon at a time. As the user scrolls down, more Pokemon are fetched and displayed.
- **Pokemon Details:** Clicking on a Pokemon displays a modal with detailed information about the Pokemon, including its image, height, weight, types, and abilities.
- **Search Functionality:** A search bar allows users to filter the Pokemon list by name. The search is case-insensitive and filters Pokemon as you type. The search bar can be toggled on and off by clicking search icon.

- **Back-to-top Button:** A back-to-top button is provided for easy navigation. When clicked, it scrolls the page back to the top.

## Usage
To use the application, simply open the `index.html` file in your web browser. You will see a list of Pokemon. Click on a Pokemon's name to see more details about that Pokemon.

## Technologies and Dependencies

This project is built using a variety of modern web development technologies and dependencies to ensure a high-quality, user-friendly application.

### JavaScript ES6
The core functionality of the application is written in JavaScript ES6. This includes the use of promises for asynchronous operations, arrow functions for cleaner syntax, and modules for better code organization.

### jQuery
jQuery is used to simplify the DOM manipulation and event handling. It provides a powerful, easy-to-use API for interacting with HTML documents.

### Bootstrap
Bootstrap is used for the application's responsive layout, pre-designed components, and modal dialogs. It ensures that the application looks good on all screen sizes, provides a consistent user experience, and allows for interactive modal dialogs to display detailed information about each Pokemon.

### PokeAPI
The PokeAPI is used to fetch the data about the Pokemon. It is a RESTful API that provides data about all known Pokemon, including their names, types, abilities, and images.

### Prettier and ESLint
Prettier is used to automatically format the code to ensure it follows a consistent style. ESLint is used to catch potential bugs and enforce best practices. Together, they help maintain the quality and readability of the code.

### Other Dependencies
Other dependencies include the Fetch API for making HTTP requests, and the Immediately Invoked Function Expression (IIFE) pattern for encapsulating the Pokemon repository.


