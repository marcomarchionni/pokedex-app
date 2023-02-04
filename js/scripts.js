let pokemonRepository = (function () {
  let repository = {
    AH: [],
    IQ: [],
    RZ: [],
  };
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=100';
  let colors = ['red', 'violet', 'gold', 'green', 'pink'];
  let buttonListContainer = $('#pokemon-list-container');
  let modalContent = $('#modalContent');
  let modalTitle = $('#modalTitle');
  let modalBody = $('#modalBody');
  let navButtons = $('.nav-link');
  navButtons.click(setActiveNavButton);
  $('#AHNavButton').click(showButtonList('AH'));
  $('#IQNavButton').click(showButtonList('IQ'));
  $('#RZNavButton').click(showButtonList('RZ'));

  /* --- Helper methods --- */
  function formatText(sentence) {
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

  /* --- Pokemon prototype --- */
  function Pokemon(item) {
    this.name = formatText(item.name);
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
        let type = formatText(t.type.name);
        types = types + type + ', ';
      });
      this.types = types.slice(0, -2);

      // add stats
      let stats = new Map();
      details.stats.forEach(function (s) {
        let statName = formatText(s.stat.name);
        let statValue = s.base_stat;
        stats.set(statName, statValue);
      });
      this.stats = stats;
    };
  }

  /* --- API calls --- */
  // Fetch a list of pokemons from API
  function loadRepository() {
    function insertPokemon(item) {
      function itemIsValid(item) {
        let isObject = typeof item === 'object';
        let hasName = 'name' in item;
        let hasUrl = 'url' in item;
        let itemIsValid = isObject && hasName && hasUrl;
        return itemIsValid;
      }

      function getRepoList(name) {
        if (name.localeCompare('i') === -1) {
          // name is alphabetically before I
          return repository.AH;
        } else if (name.localeCompare('r') !== -1) {
          // name is alphabetically after R
          return repository.RZ;
          // name is between I and Q
        } else return repository.IQ;
      }

      function addToRepo(pokemon) {
        let list = getRepoList(pokemon.name);
        let insertionIndex = list.findIndex(
          (i) => pokemon.name.localeCompare(i.name) === -1
        );
        let insertAtTheEnd = insertionIndex === -1;
        if (insertAtTheEnd) {
          list.push(pokemon);
        } else {
          list.splice(insertionIndex, 0, pokemon);
        }
      }

      if (itemIsValid(item)) {
        // insert pokemon
        let pokemon = new Pokemon(item);
        let list = getRepoList(pokemon.name);
        addToRepo(pokemon);
      } else {
        console.log('Invalid item');
      }
    }

    return $.ajax(apiUrl)
      .then(function (json) {
        json.results.forEach(insertPokemon);
      })
      .then(function () {
        console.log(repository);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Fetch a pokemon's full details from API
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

    return $.ajax(pokemon.detailsUrl)
      .then(function (details) {
        if (detailsAreValid(details)) pokemon.setFullDetails(details);
        return pokemon;
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  /* --- DOM Manipulation --- */

  function setActiveNavButton(e) {
    // clear previour active button
    navButtons.removeClass('active').removeAttr('aria-current');

    // set target button active
    $(e.target).addClass('active').attr('aria-current', 'page');
  }

  function addListButton(pokemon) {
    //setup button
    let pokemonButton = $(`<button>${pokemon.name}</button>`)
      .attr('data-bs-toggle', 'modal')
      .attr('data-bs-target', '#pokemonModal')
      .addClass('btn')
      .addClass('btn-block')
      .addClass(`btn-pokemon--${pokemon.color}`)
      .on('click', showPokemonDetails(pokemon));

    // append element
    buttonListContainer.append(pokemonButton);
  }

  function setModalContent(pokemon) {
    // reset modal
    modalTitle.empty();
    modalBody.empty();
    modalContent.removeClass();
    // set modal color
    modalContent.addClass(`modal-content p-4 modal--${pokemon.color}`);

    // set modal title
    modalTitle.text(pokemon.name);

    // set modal info
    let container = $('<div></div>').addClass('container-fluid text-center');
    let mainRow = $('<div></div>').addClass('row g-2');

    // compose img column
    let imgCol = $('<div></div>').addClass('col-lg-6');
    let pokemonImg = $('<img></img>')
      .addClass('img-fluid')
      .attr('src', `${pokemon.imageUrl}`)
      .attr('alt', `${pokemon.name} artwork`);
    imgCol.append(pokemonImg);

    // compose misc column
    let miscColumn = $('<div></div>').addClass(
      'col-lg-2 col-sm-4 d-flex flex-column'
    );
    let heightCell = $('<div></div>')
      .addClass('col modal-cell')
      .append('<h5>Height</h5>')
      .append(`<p>${pokemon.height}</p>`);

    let weightCell = $('<div></div>')
      .addClass('col modal-cell')
      .append('<h5>Weight</h5>')
      .append(`<p>${pokemon.weight}</p>`);

    let typesCell = $('<div></div>')
      .addClass('col modal-cell')
      .append('<h5>Types</h5>')
      .append(`<p>${pokemon.types}</p>`);

    miscColumn.append(heightCell).append(weightCell).append(typesCell);

    // compose stats column
    let statsColumn = $('<div></div>').addClass(
      'col-lg-4 col-sm-8 d-flex flex-column'
    );
    let statsCell = $('<div></div>').addClass('modal-cell flex-fill');
    let statsTitle = $('<h5>Stats</h5>');
    let statsTable = $('<table></table>').addClass(
      'table table-borderless text-start m-auto'
    );
    let statsTbody = $('<tbody></tbody>');

    for (let [statName, statValue] of pokemon.stats) {
      let tRow = $('<tr></tr>');
      let tHeader = $(`<th>${statName}</th>`);
      let tData = $(`<td>${statValue}</td>`);
      tRow.append(tHeader).append(tData);
      statsTbody.append(tRow);
    }
    statsTable.append(statsTbody);
    statsCell.append(statsTitle).append(statsTable);
    statsColumn.append(statsCell);

    // append components
    mainRow.append(imgCol).append(miscColumn).append(statsColumn);
    container.append(mainRow);
    modalBody.append(container);
  }

  /* --- Event Handlers --- */
  function showPokemonDetails(pokemon) {
    return function () {
      loadDetails(pokemon).then(function (pokemon) {
        setModalContent(pokemon);
      });
    };
  }

  function showButtonList(key) {
    return () => {
      // clear list
      buttonListContainer.empty();
      // populate list
      repository[key].forEach(addListButton);
    };
  }

  /* --- Init app --- */
  function init() {
    loadRepository().then(showButtonList('AH'));
  }

  return init();
})();
