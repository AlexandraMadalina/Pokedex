let api = "https://pokeapi.co/api/v2/pokemon";
let listOfNames = document.getElementsByClassName("list-group")[0];
const nameId = document.querySelectorAll(".pokeDetails p span");
const pokeImg = document.querySelector(".pokeDetails img");
const movesList = document.querySelector(".moves");
const evolution = document.querySelector(".evolution");

function getApi(uri) {
  return fetch(uri).then(response => response.json());
}

let results = [];
async function getAllPokemons(obj) {
  const response = await getApi(obj);
  let resArr = response.results;
  resArr.forEach(element => {
    results.push(element);
    addPokemon(element.name, element.url);
  });
  if (resArr.length == 20) {
    getAllPokemons(response.next);
  }
}

getAllPokemons(api);

// Make a list with all the pokemons
function addPokemon(name, source) {
  const a = makeListElem(source);
  const text = document.createTextNode(name);
  a.appendChild(text);
  a.onclick = event => {
    const link = event.target.getAttribute("data-source");
    getDetails(link);
  };
  listOfNames.appendChild(a);
}

function makeListElem(atribute) {
  const a = document.createElement("a");
  a.classList.add("list-group-item", "list-group-item-action");
  a.setAttribute("data-source", atribute);
  return a;
}
// list end

// Make a profile picture and a list of moves
async function getDetails(url) {
  const data = await getApi(url);
  console.log(data);
  pokeImg.src = data.sprites.front_default;
  nameId[0].innerText = data.id;
  const name = data.name;
  nameId[1].innerText = name.charAt(0).toUpperCase() + name.slice(1);
  const moves = data.moves;
  console.log(data.moves);
  moves.forEach(element => {
    const a = makeListElem(element.move.url);
    const moveTitle = document.createTextNode(element.move.name);
    a.appendChild(moveTitle);
    movesList.appendChild(a);
  });
  makeEvolution(data.species.url);
}
// list end
// Evolution
async function makeEvolution(pokeUrl) {
  evolution.innerHTML = "";
  const species = await getApi(pokeUrl);
  console.log(species);
  createEvolution(species.evolution_chain.url);
}

async function createEvolution(obj) {
  const data = await getApi(obj);
  console.log(data);
  makeEvCol(data.chain);
  getAllForms(data.chain.evolves_to);
}
function getAllForms(poke) {
  console.log(poke);
  for (let i = 0; i < poke.length; ++i) {
    console.log(poke[i]);
    makeEvCol(poke[i]);
    getAllForms(poke[i].evolves_to);
  }
}
async function makeEvCol(pokemon) {
  console.log(pokemon);
  const pokeForm = await getApi(`${api}/${pokemon.species.name}`);
  console.log(pokeForm);

  let evolutionCol = document.createElement("div");
  evolutionCol.classList.add("col");
  let img = document.createElement("img");
  const p = document.createElement("p");
  const t = document.createTextNode(pokeForm.species.name);
  img.src = pokeForm.sprites.front_default;
  evolutionCol.appendChild(img);
  p.appendChild(t);
  evolutionCol.appendChild(p);
  evolution.appendChild(evolutionCol);
}
// Search filter
const inputPoke = document.getElementsByClassName("form-control")[0];
inputPoke.oninput = () => {
  const allNames = listOfNames.children;
  for (let i = 0; i < allNames.length; i++) {
    let name = allNames[i].innerText;
    let inputValue = inputPoke.value;
    var start = name.toUpperCase().indexOf(inputValue.toUpperCase());
    if (start > -1) {
      var end = start + inputValue.length;
      var replace = name.substring(start, end);
      allNames[i].innerHTML =
        name.substring(0, start) +
        '<span style = "background-color: yellow">' +
        replace +
        "</span>" +
        name.substring(end, name.length);
      allNames[i].style.display = "";
    } else {
      allNames[i].style.display = "none";
    }
  }
};
//filter end;
