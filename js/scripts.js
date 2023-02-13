(function pokedexApp() {
  const repository = {
    AH: [],
    IQ: [],
    RZ: [],
  };
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=100';
  const colors = ['red', 'violet', 'gold', 'green', 'pink'];
  const buttonListContainer = $('#pokemon-list-container');
  const modalContent = $('#modalContent');
  const modalTitle = $('#modalTitle');
  const modalBody = $('#modalBody');
  const navButtons = $('.nav-link');

  /* --- Helper methods --- */
  function formatText(sentence) {
    function capitalize(w) {
      return w.charAt(0).toUpperCase() + w.slice(1);
    }
    const words = sentence.split(/[_-\s]/);
    const capitalizedWords = words.map(capitalize);
    return capitalizedWords.join(' ');
  }

  function getRandomColor() {
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
  }

  function getColor(url) {
    const speciesUrl = url.replace('pokemon', 'pokemon-species');
    console.log(speciesUrl);
  }

  /* --- Pokemon prototype --- */
  function Pokemon(item) {
    this.id = this.name = formatText(item.name);
    this.detailsUrl = item.url;
    this.speciesUrl = item.url.replace('pokemon', 'pokemon-species');
    this.setFullDetails = function setFullDetails(details) {
      // add img url
      this.imageUrl = details.sprites.other['official-artwork'].front_default;

      // add properties
      const props = new Map();
      props.set('Heigth', `${details.height / 10} m`);
      props.set('Weight', `${details.weight / 10} kg`);

      const types = details.types
        .map((t) => formatText(t.type.name))
        .join(', ');
      props.set('Types', types);
      this.props = props;

      // add stats
      const stats = new Map();
      details.stats.forEach((s) => {
        const statName = formatText(s.stat.name);
        const statValue = s.base_stat;
        stats.set(statName, statValue);
      });
      this.stats = stats;
    };
    this.getColor = function () {
      return $.ajax(this.speciesUrl)
        .then((json) => {
          console.log(json.color.name);
          this.color = json.color.name;
          return this.color;
        })
        .catch((error) => {
          console.error(error);
        });
    };
  }

  /* --- API calls --- */
  // Fetch list of pokemons from API
  function loadRepository() {
    function insertPokemon(item) {
      function itemIsValid(i) {
        const isObject = typeof i === 'object';
        const hasName = 'name' in i;
        const hasUrl = 'url' in i;
        const isValid = isObject && hasName && hasUrl;
        return isValid;
      }

      function getRepoList(name) {
        if (name.localeCompare('i') === -1) {
          // name is alphabetically before I
          return repository.AH;
        }
        if (name.localeCompare('r') !== -1) {
          // name is alphabetically after R
          return repository.RZ;
          // name is between I and Q
        }
        return repository.IQ;
      }

      function addToRepo(pokemon) {
        const list = getRepoList(pokemon.name);
        const insertionIndex = list.findIndex(
          (i) => pokemon.name.localeCompare(i.name) === -1
        );
        const insertAtTheEnd = insertionIndex === -1;
        if (insertAtTheEnd) {
          list.push(pokemon);
        } else {
          list.splice(insertionIndex, 0, pokemon);
        }
      }

      if (itemIsValid(item)) {
        addToRepo(new Pokemon(item));
      } else {
        console.error('Invalid item');
      }
    }

    return $.ajax(apiUrl)
      .then((json) => {
        json.results.forEach(insertPokemon);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Fetch pokemon's full details from API
  function loadDetails(pokemon) {
    function detailsAreValid(details) {
      let isValid;
      try {
        const imgNotNull =
          details.sprites.other['official-artwork'].front_default !== null;
        const heightNotNull = details.height !== null;
        const weightNotNull = details.weight !== null;
        const typesNotNull = details.types !== null;
        const statsNotNull = details.stats !== null;
        isValid =
          imgNotNull &&
          imgNotNull &&
          heightNotNull &&
          weightNotNull &&
          typesNotNull &&
          statsNotNull;
        return isValid;
      } catch (e) {
        console.error(e);
        return false;
      }
    }

    return $.ajax(pokemon.detailsUrl)
      .then((details) => {
        if (detailsAreValid(details)) pokemon.setFullDetails(details);
        return pokemon;
      })
      .catch((e) => {
        console.error(e);
      });
  }

  /* --- DOM Manipulation --- */

  function setModalBody(pokemon) {
    modalContent.removeClass();
    // set modal color
    modalContent.addClass(`modal-content p-4 modal--${pokemon.color}`);

    // set modal title
    modalTitle.text(pokemon.name);

    // set modal info
    const container = $('<div></div>').addClass('container-fluid text-center');
    const mainRow = $('<div></div>').addClass('row gx-2');

    // compose img column
    const imgCol = $('<div></div>').addClass('col-lg-6');
    const pokemonImg = $('<img></img>')
      .addClass('img-fluid')
      .attr('src', `${pokemon.imageUrl}`)
      .attr('alt', `${pokemon.name} artwork`);
    imgCol.append(pokemonImg);

    // compose props column
    const propColumn = $('<div></div>').addClass(
      'col-lg-2 col-sm-4 d-flex flex-column'
    );
    pokemon.props.forEach((value, prop) => {
      const propCell = $('<div></div>').addClass('bg-light p-4 my-1 rounded-4');
      const propTitle = $(`<h5>${prop}</h5>`).addClass('fw-bold');
      const propValue = $(`<p>${value}</p>`);
      propCell.append(propTitle).append(propValue);
      propColumn.append(propCell);
    });

    // compose stats column
    const statsColumn = $('<div></div>').addClass(
      'col-lg-4 col-sm-8 d-flex flex-column'
    );
    const statsCell = $('<div></div>').addClass(
      'bg-light py-4 px-3 my-1 rounded-4 flex-fill'
    );
    const statsTitle = $('<h5>Stats</h5>').addClass('fw-bold');
    const statsTable = $('<table></table>').addClass(
      'table table-borderless text-start m-auto'
    );
    const statsTbody = $('<tbody></tbody>');

    pokemon.stats.forEach((value, key) => {
      const tRow = $('<tr></tr>');
      const tHeader = $(`<th>${key}</th>`);
      const tData = $(`<td>${value}</td>`);
      tRow.append(tHeader).append(tData);
      statsTbody.append(tRow);
    });

    statsTable.append(statsTbody);
    statsCell.append(statsTitle).append(statsTable);
    statsColumn.append(statsCell);

    // append components
    mainRow.append(imgCol).append(propColumn).append(statsColumn);
    container.append(mainRow);
    modalBody.append(container);
  }

  function showPokemonDetails(pokemon) {
    return () => {
      // set modal title
      modalTitle.text(pokemon.name);
      // set modal color
      modalContent.removeClass();
      modalContent.addClass(`modal-content p-4 modal--${pokemon.color}`);
      // reset modal body
      modalBody.empty();
      // set modal body
      loadDetails(pokemon).then(() => {
        setModalBody(pokemon);
      });
    };
  }

  function addButton(pokemon) {
    // setup button
    const pokemonButton = $(`<button>${pokemon.name}</button>`)
      .attr('data-bs-toggle', 'modal')
      .attr('data-bs-target', '#pokemonModal')
      .addClass('btn')
      .addClass('btn-block')
      .addClass(`btn-pokemon`)
      .on('click', showPokemonDetails(pokemon));

    // append element
    buttonListContainer.append(pokemonButton);

    // set color
    pokemon.getColor().then((color) => {
      console.log(color);
      pokemonButton.addClass(`btn-pokemon--${color}`);
    });
  }

  function showButtonList(subset) {
    return () => {
      // clear list
      buttonListContainer.empty();
      // populate list
      repository[subset].forEach(addButton);
    };
  }

  function setActiveNavButton(e) {
    // clear previour active button
    navButtons.removeClass('active').removeAttr('aria-current');

    // set target button active
    $(e.target).addClass('active').attr('aria-current', 'page');
  }

  navButtons.click(setActiveNavButton);
  $('#AHNavButton').click(showButtonList('AH'));
  $('#IQNavButton').click(showButtonList('IQ'));
  $('#RZNavButton').click(showButtonList('RZ'));

  /* --- Init app --- */
  function init() {
    loadRepository().then(showButtonList('AH'));
  }

  return init();
})();
