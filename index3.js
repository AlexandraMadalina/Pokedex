let myRequest = new XMLHttpRequest();

function getAPI(url, calback) {
    myRequest.open('GET', url);
    myRequest.onload = () => {
        const data = JSON.parse(myRequest.response);
        calback(data);
        console.log(data);
    }
    myRequest.send();
}

function getPokeNames(response) {
    const results = response.results;
    results.forEach(element => {
        addPokeName(element.name, element.url);
        pokeArr.push(element.url);
    });
    if (results.length == 20) {
        const next = response.next;
        getAPI(next, getPokeNames);
        myRequest.open('GET', next);
        myRequest.send();
    }
}
const pokeArr = [];

getAPI('https://pokeapi.co/api/v2/pokemon', getPokeNames);

let listOfNames = document.getElementsByClassName('list-group')[0];
const pokeImg = document.querySelector('.pokeDetails img');
const nameId = document.querySelectorAll('.pokeDetails p span');

function addPokeName(name, source) {
    const a = makeListElem(source);
    const text = document.createTextNode(name);
    a.appendChild(text);
    a.onclick = (event) => {
        const api = event.target.getAttribute('data-source');
        getAPI(api, getDetails);
    }
    listOfNames.appendChild(a);

}

function makeListElem(atribute) {
    const a = document.createElement('a');
    a.classList.add('list-group-item', 'list-group-item-action');
    a.setAttribute("data-source", atribute);
    return a;
}

function getRandompoke() {
    setTimeout(() => {
        const random = Math.floor(Math.random() * (pokeArr.length + 1));
        getAPI(pokeArr[random], getDetails);
    }, 200)
}
getRandompoke();

const movesList = document.querySelector('.moves');
const evolution = document.querySelector('.evolution');



function makeEvolution(obj) {
    evolution.innerHTML = '';
    getAPI(obj.species.url, seeEvo);

}

function seeEvo(species) {
    getAPI(species.evolution_chain.url, function (data) {
        console.log(data);
        console.log('trilulilu');
        const name = data.chain.species.name;
        let evolutionCol = document.createElement('div');
        evolutionCol.classList.add('col');
        let img = document.createElement('img');
        const p = document.createElement('p');
        const t = document.createTextNode(name);
        evolutionCol.appendChild(img);
        p.appendChild(t);
        evolutionCol.appendChild(p);
        evolution.appendChild(evolutionCol);
        getAPI(`https://pokeapi.co/api/v2/pokemon/${name}`, function (dataImg) {
            img.src = dataImg.sprites.front_default;
            getEvo(data.chain.evolves_to);
        });
    });
}
let arr = [];

function getEvo(pokeEvo) {
    console.log(pokeEvo);
    if (pokeEvo[0]) {
        for (let i = 0; i< pokeEvo.length; i++) {
            let evolutionCol = document.createElement('div');
            evolutionCol.classList.add('col');
            let img = document.createElement('img');
            const p = document.createElement('p');
            const t = document.createTextNode(pokeEvo[i].species.name);
            evolutionCol.appendChild(img);
            p.appendChild(t);
            evolutionCol.appendChild(p);
            evolution.appendChild(evolutionCol);
            if (pokeEvo[i + 1]) {
                getEvoApi(pokeEvo[i], pokeEvo[i + 1], img);
                return;
            }
            
            getAPI(`https://pokeapi.co/api/v2/pokemon/${pokeEvo[i].species.name}`, function (data) {
                img.src = data.sprites.front_default;
                
                console.log(data.sprites.front_default);

                getEvo(pokeEvo[i].evolves_to);
            });


        }
    }
}

function getEvoApi(first, second, image) {
    getAPI(`https://pokeapi.co/api/v2/pokemon/${first.species.name}`, function (data) {
        image.src = data.sprites.front_default;
        console.log(data.sprites.front_default);
        console.log(second);
        getEvo(data.evolves_to);
        getAPI(`https://pokeapi.co/api/v2/pokemon/${second.species.name}`, function (data) {
            image.src = data.sprites.front_default;
        getEvo(data.evolves_to);
        })
    })
}

function makeEvCol(pokemon, calback) {
    console.log('tada');
    let evolutionCol = document.createElement('div');
    evolutionCol.classList.add('col');
    let img = document.createElement('img');
    const p = document.createElement('p');
    const t = document.createTextNode(name);
    evolutionCol.appendChild(img);
    p.appendChild(t);
    evolutionCol.appendChild(p);
    evolution.appendChild(evolutionCol);
    calback(pokemon.evolves_to);
}





function getDetails(res) {
    //console.log(res);
    makeEvolution(res);
    pokeImg.src = res.sprites.front_default;
    nameId[0].innerText = res.id;
    const name = res.name;
    nameId[1].innerText = name.charAt(0).toUpperCase() + name.slice(1);
    const moves = res.moves;

    moves.forEach(element => {
        const a = makeListElem(element.move.url);
        const moveTitle = document.createTextNode(element.move.name);
        a.appendChild(moveTitle);
        movesList.appendChild(a);

        /* a.onclick = (event) => {
             const api = event.target.getAttribute('data-source');
             getAPI(api, moveDetails);

             function moveDetails(mov) {
                 const accuracy = mov.accuracy;
                 const power = mov.power;
                 const pp = mov.pp;
                 a.innerHTML = `
             <ul>
             <li>Accuracy: ${accuracy}</li>
             <li>P: ower${power}</li>
             <li>PP: ${pp}</li>
             </ul>
             `
             }

         }*/
    })
}


const inputPoke = document.getElementsByClassName('form-control')[0];
inputPoke.oninput = () => {
    const allNames = listOfNames.children;
    for (let i = 0; i < allNames.length; i++) {
        let name = allNames[i].innerText;
        let inputValue = inputPoke.value;
        var start = name.toUpperCase().indexOf(inputValue.toUpperCase());
        if (start > -1) {
            var end = start + inputValue.length;
            var replace = name.substring(start, end);
            allNames[i].innerHTML = name.substring(0, start) +
                '<span style = "background-color: yellow">' + replace + "</span>" + name
                .substring(end, name.length);
            allNames[i].style.display = "";
        } else {
            allNames[i].style.display = "none";
        }
    }
}