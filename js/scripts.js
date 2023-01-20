let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=30';
  let colors = ['red', 'violet', 'gold', 'green', 'pink'];
  let pokemonKeys = ['name', 'detailsUrl'];

  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function loadDetails(item) {
    return fetch(item.detailsUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.weight = details.weight;
        item.types = details.types;
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  function isValidPokemon(item) {
    function keysAreDifferent(keys1, keys2) {
      keys1.sort().join() !== keys2.sort().join();
    }

    // check if argument is an object
    if (typeof item !== 'object') {
      console.log('Argument is not an object');
      return false;
    }

    // validate argument properties keys
    let itemKeys = Object.keys(item);
    if (keysAreDifferent(itemKeys, pokemonKeys)) {
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
    function getColor() {
      let index = Math.floor(Math.random() * colors.length);
      return colors[index];
    }
    function getPokemonName(pokemon) {
      return pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    }

    let pokemonListNode = document.querySelector('.pokemon-list');

    //setup list item
    let listItem = document.createElement('li');
    listItem.classList.add('pokemon-list__item');

    //setup button
    let itemButton = document.createElement('button');
    itemButton.innerText = getPokemonName(pokemon);
    itemButton.classList.add('pokemon-button');
    itemButton.classList.add(`pokemon-button--${getColor()}`);
    itemButton.addEventListener('click', showDetails(pokemon));

    // append elements
    listItem.appendChild(itemButton);
    pokemonListNode.appendChild(listItem);
  }

  function showDetails(pokemon) {
    return function () {
      loadDetails(pokemon).then(function () {
        console.log(pokemon);
      });
    };
  }

  return {
    add: add,
    loadList: loadList,
    loadDetails: loadDetails,
    getByName: getByName,
    getAll: getAll,
    addListItem: addListItem,
  };
})();

//init list
pokemonRepository.loadList().then(function () {
  // write html pokemon list
  pokemonRepository.getAll().forEach(pokemonRepository.addListItem);
});
