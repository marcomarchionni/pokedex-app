let = pokemonRepository = (function () {
  let pokemonKeys = ['name', 'types', 'height', 'weight', 'values'];
  let pokemonValuesKeys = ['hp', 'attack', 'defense', 'speed'];
  let pokemonList = [
    {
      name: 'Bulbasaur',
      types: ['grass', 'poison'],
      height: 0.7,
      weight: 6.9,
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
      values: {
        hp: 83,
        attack: 80,
        defense: 75,
        speed: 101,
      },
    },
  ];

  function stringArraysHaveSameValues(arr1, arr2) {
    return arr1.sort().join() === arr2.sort().join();
  }

  function isValidPokemon(item) {
    // check if argument is an object
    if (typeof item !== 'object') {
      console.log('Argument is not an object');
      return false;
    }

    // validate argument properties keys
    let itemKeys = Object.keys(item);
    if (!stringArraysHaveSameValues(itemKeys, pokemonKeys)) {
      console.log('Argument properties are not valid');
      return false;
    }

    let itemValuesKeys = Object.keys(item.values);
    if (!stringArraysHaveSameValues(itemValuesKeys, pokemonValuesKeys)) {
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

  return {
    add: add,
    getByName: getByName,
    getAll: getAll,
  };
})();

function printPokemon(pokemon) {
  let howBigNote = '';

  // add a note for Pokemons higher than 1m
  if (pokemon.height > 1) {
    howBigNote = " - Wow! That's Big!";
  }

  document.write(
    `<p><span class="name">${pokemon.name} </span>
    (<span class=height>height:</span> ${pokemon.height}m)${howBigNote}</p>`
  );
}

// write main logo and pokemon list
document.write('<h1>Pokémon List</h2>');
pokemonRepository.getAll().forEach(printPokemon);

// test add and getByName methods
let pinkPokemon = {
  name: 'Pink',
  types: ['fire'],
  height: 0.2,
  weight: 1.5,
  values: {
    hp: 18,
    attack: 12,
    defense: 89,
    speed: 99,
  },
};

pokemonRepository.add(pinkPokemon);
console.log(pokemonRepository.getAll());

let pidgeotPokemon = pokemonRepository.getByName('Pidgeot');
console.log(pidgeotPokemon);
