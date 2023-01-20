let pokemonRepository = (function () {
  let pokemonList = [
    {
      name: 'Bulbasaur',
      types: ['grass', 'poison'],
      height: 0.7,
      weight: 6.9,
      color: 'green',
      values: {
        hp: 45,
        attack: 49,
        defense: 49,
        speed: 45,
      },
    },
    {
      name: 'Ivysaur',
      types: ['grass', 'poison'],
      height: 1,
      weight: 13,
      color: 'red',
      values: {
        hp: 60,
        attack: 62,
        defense: 63,
        speed: 60,
      },
    },
    {
      name: 'Charmander',
      types: ['fire'],
      height: 0.6,
      weight: 8.5,
      color: 'violet',
      values: {
        hp: 39,
        attack: 52,
        defense: 43,
        speed: 65,
      },
    },
    {
      name: 'Pidgeot',
      types: ['flying', 'normal'],
      height: 1.5,
      weight: 39.5,
      color: 'gold',
      values: {
        hp: 83,
        attack: 80,
        defense: 75,
        speed: 101,
      },
    },
  ];

  function isValidPokemon(item) {
    let pokemonKeys = ['name', 'types', 'height', 'weight', 'values'];
    let pokemonValuesKeys = ['hp', 'attack', 'defense', 'speed'];

    // helper method to compare arrays of Keys
    function objectKeysAreDifferent(arr1, arr2) {
      return arr1.sort().join() !== arr2.sort().join();
    }

    // check if argument is an object
    if (typeof item !== 'object') {
      console.log('Argument is not an object');
      return false;
    }

    // validate argument properties keys
    let itemKeys = Object.keys(item);
    if (objectKeysAreDifferent(itemKeys, pokemonKeys)) {
      console.log('Argument properties are not valid');
      return false;
    }

    let itemValuesKeys = Object.keys(item.values);
    if (objectKeysAreDifferent(itemValuesKeys, pokemonValuesKeys)) {
      console.log('Argument properties are not valid');
      return false;
    }

    return true;
  }

  function add(newPokemon) {
    if (isValidPokemon(newPokemon)) {
      pokemonList.push(newPokemon);
    }
  }

  function getByName(name) {
    let result = pokemonList.filter(function (p) {
      return p.name === name;
    });
    if (result.length > 0) {
      return result[0];
    } else {
      console.log('No Pokemon found with name: ' + name);
    }
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    let pokemonListNode = document.querySelector('.pokemon-list');

    //setup list item
    let listItem = document.createElement('li');
    listItem.classList.add('pokemon-list__item');

    //setup button
    let itemButton = document.createElement('button');
    itemButton.innerText = pokemon.name;
    itemButton.classList.add('pokemon-button');
    itemButton.classList.add(`pokemon-button--${pokemon.color}`);
    itemButton.addEventListener('click', showDetails(pokemon));

    // append elements
    listItem.appendChild(itemButton);
    pokemonListNode.appendChild(listItem);
  }

  function showDetails(pokemon) {
    return function () {
      console.log(pokemon);
    };
  }

  return {
    add: add,
    getByName: getByName,
    getAll: getAll,
    addListItem: addListItem,
  };
})();

// write main logo and pokemon list
pokemonRepository.getAll().forEach(pokemonRepository.addListItem);
