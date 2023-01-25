let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=30';
  let colors = ['red', 'violet', 'gold', 'green', 'pink'];
  let pokemonKeys = ['name', 'detailsUrl'];
  let modalContainer = document.querySelector('.modal-container');

  // Generic helper methods
  function polishText(sentence) {
    function capitalize(w) {
      return w.charAt(0).toUpperCase() + w.slice(1);
    }
    let words = sentence.split(/[_-\s]/);
    let capitalizedWords = words.map(capitalize);
    return capitalizedWords.join(' ');
  }

  function getRandomColor() {
    let index = Math.floor(Math.random() * colors.length);
    return colors[index];
  }

  // Pokemon prototype
  function Pokemon(item) {
    this.name = polishText(item.name);
    this.detailsUrl = item.url;
    this.color = getRandomColor();
    this.setFullDetails = function (details) {
      // add basic properties
      this.imageUrl = details.sprites.other['official-artwork'].front_default;
      this.height = `${details.height / 10} m`;
      this.weight = `${details.weight / 10} kg`;

      // add types
      let types = '';
      details.types.forEach(function (t) {
        let type = polishText(t.type.name);
        types = types + type + ', ';
      });
      this.types = types.slice(0, -2);

      // add stats
      let stats = new Map();
      details.stats.forEach(function (s) {
        let statName = polishText(s.stat.name);
        let statValue = s.base_stat;
        stats.set(statName, statValue);
      });
      this.stats = stats;
    };
  }

  // API call for base item
  function loadList() {
    function itemIsValid(item) {
      let isValid;
      try {
        hasName = item.name != null;
        hasUrl = item.url != null;
        isValid = hasName && hasUrl;
      } catch (e) {
        console.log('Pokemon data is not valid');
        console.log(e);
        isValid = false;
      } finally {
        return isValid;
      }
    }

    function addPokemon(item) {
      if (itemIsValid(item)) {
        //add new pokemon to repository
        let pokemon = new Pokemon(item);
        pokemonList.push(pokemon);
      }
    }

    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(addPokemon);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // API call for full details
  function loadDetails(pokemon) {
    function detailsAreValid(details) {
      let isValid;
      try {
        let imgNotNull =
          details.sprites.other['official-artwork'].front_default !== null;
        let heightNotNull = details.height !== null;
        let weightNotNull = details.weight !== null;
        let typesNotNull = details.types !== null;
        let statsNotNull = details.stats !== null;
        isValid =
          imgNotNull &&
          imgNotNull &&
          heightNotNull &&
          weightNotNull &&
          typesNotNull &&
          statsNotNull;
      } catch (e) {
        console.log(e);
        isValid = false;
      } finally {
        return isValid;
      }
    }

    return fetch(pokemon.detailsUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        if (detailsAreValid(details)) pokemon.setFullDetails(details);
        return pokemon;
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
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
    itemButton.classList.add(`pokemon-button--${pokemon.color}`);
    itemButton.addEventListener('click', showPokemonDetails(pokemon));

    // append elements
    listItem.appendChild(itemButton);
    pokemonListNode.appendChild(listItem);
  }

  function appendModal(pokemon) {
    function createGridTextItem(title, text) {
      let item = document.createElement('div');
      let customClass = `modal-grid__${title.toLowerCase()}`;
      item.classList.add('modal-grid__text-item', customClass);
      let itemTitle = document.createElement('h3');
      itemTitle.innerText = title;
      let itemValue = document.createElement('p');
      itemValue.innerText = text;
      item.appendChild(itemTitle);
      item.appendChild(itemValue);
      return item;
    }

    function closeModal() {
      modalContainer.classList.remove('is-visible');
    }

    // clear container
    modalContainer.innerHTML = '';

    // create modal
    let modal = document.createElement('div');
    modal.classList.add('modal');
    modal.classList.add(`modal--${pokemon.color}`);

    // > create and append modal-close button
    let modalClose = document.createElement('button');
    modalClose.classList.add('modal-close');
    let modalCloseIcon = document.createElement('img');
    modalCloseIcon.classList.add('modal-close__icon');
    modalCloseIcon.setAttribute('src', 'img/close-icon.png');
    modalClose.appendChild(modalCloseIcon);
    modalClose.addEventListener('click', closeModal);
    modal.appendChild(modalClose);

    // > create and append modal title
    let modalTitle = document.createElement('h2');
    modalTitle.classList.add('modal-title');
    modalTitle.innerText = pokemon.name;
    modal.appendChild(modalTitle);

    // > create modal grid
    let modalGrid = document.createElement('div');
    modalGrid.classList.add('modal-grid');

    // >> create and append img item
    let imgItem = document.createElement('img');
    imgItem.classList.add('modal-grid__img');
    imgItem.setAttribute('src', pokemon.imageUrl);
    modalGrid.appendChild(imgItem);

    // >> create and append text items
    let heightItem = createGridTextItem('Height', pokemon.height);
    modalGrid.appendChild(heightItem);
    let weightItem = createGridTextItem('Weight', pokemon.weight);
    modalGrid.appendChild(weightItem);
    let typesItem = createGridTextItem('Types', pokemon.types);
    modalGrid.appendChild(typesItem);

    // >> create stats item
    let statsItem = document.createElement('div');
    statsItem.classList.add('modal-grid__text-item', 'modal-grid__stats');

    let statsTitle = document.createElement('h3');
    statsTitle.innerText = 'Stats';
    statsItem.appendChild(statsTitle);

    // >>> create and append stats table
    let statsTable = document.createElement('table');
    let statsTbody = document.createElement('tbody');
    let statsMap = pokemon.stats;
    for (let [statName, statValue] of statsMap) {
      let tableRow = document.createElement('tr');
      let tableHeader = document.createElement('th');
      tableHeader.innerText = statName;
      let tableData = document.createElement('td');
      tableData.innerText = statValue;
      tableRow.appendChild(tableHeader);
      tableRow.appendChild(tableData);
      statsTbody.appendChild(tableRow);
    }
    statsTable.appendChild(statsTbody);

    // <<< append stats table
    statsItem.appendChild(statsTable);

    // <<  append stats item
    modalGrid.appendChild(statsItem);

    // < append modal grid
    modal.appendChild(modalGrid);

    // append modal
    modalContainer.appendChild(modal);

    // Implement other close-modal functionalities
    // > Click outside modal
    modalContainer.addEventListener('click', function (e) {
      let target = e.target;
      if (target === modalContainer) {
        closeModal();
      }
    });
    // > Press Esc key
    window.addEventListener('keydown', function (e) {
      if (
        e.key === 'Escape' &&
        modalContainer.classList.contains('is-visible')
      ) {
        closeModal();
      }
    });

    // append modal
    modalContainer.appendChild(modal);

    // show modal container
    modalContainer.classList.add('is-visible');

    return;
  }

  function showPokemonDetails(pokemon) {
    return function () {
      loadDetails(pokemon).then(function (pokemon) {
        // delete anything in modal container
        modalContainer.innerHTML = '';

        // append modal
        appendModal(pokemon);
      });
    };
  }

  return {
    loadList: loadList,
    getAll: getAll,
    addListItem: addListItem,
  };
})();

//init list
pokemonRepository.loadList().then(function () {
  // write html pokemon list
  pokemonRepository.getAll().forEach(pokemonRepository.addListItem);
});
