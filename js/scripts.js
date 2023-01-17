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
console.log(pokemonList);

// write main logo
document.write('<h1>Pokémon List</h2>');

for (let i = 0; i < pokemonList.length; i++) {
  let pokemon = pokemonList[i];
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
