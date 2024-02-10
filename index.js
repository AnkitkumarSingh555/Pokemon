const apiUrl = 'https://pokeapi.co/api/v2/pokemon';
const tableBody = document.getElementById('pokemon-list');
const pagination = document.getElementById('pagination');

let currentPage = 1;

async function fetchPokemon(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
  }
}

async function fetchData(page) {
  try {
    const response = await fetch(`${apiUrl}?offset=${(page - 1) * 10}&limit=10`);
    const data = await response.json();
    const pokemonList = await Promise.all(data.results.map(async (pokemon) => {
      const pokemonData = await fetchPokemon(pokemon.url);
      return {
        name: pokemonData.name,
        number: pokemonData.id,
        image: pokemonData.sprites.front_default,
      };
    }));
    return pokemonList;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayData(pokemonList) {
  tableBody.innerHTML = '';
  pokemonList.forEach(pokemon => {
    const row = `
      <tr>
        <td>${pokemon.name}</td>
        <td>${pokemon.number}</td>
        <td><img src="${pokemon.image}" alt="${pokemon.name}" width="100"></td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

async function updateTable(page) {
  const pokemonData = await fetchData(page);
  displayData(pokemonData);
}

updateTable(currentPage);

pagination.innerHTML = `
  <button onclick="prevPage()">Prev</button>
  <button onclick="nextPage()">Next</button>
`;

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    updateTable(currentPage);
  }
}

function nextPage() {
  if (currentPage < 26) { 
    currentPage++;
    updateTable(currentPage);
  }
}
