let myRequest = new XMLHttpRequest();

function getAPI(url, calback) {

    myRequest.open('GET', url);
    myRequest.onload = () => {
        const data = JSON.parse(myRequest.response);
        calback(data);
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
    const a = makeListElem(name, source);
    a.onclick = (event) => {
        const api = event.target.getAttribute('data-source');
        getAPI(api, getDetails);
    }
    listOfNames.appendChild(a);

}

function makeListElem(content, atribute) {
    const a = document.createElement('a');
    const text = document.createTextNode(content);
    a.appendChild(text);
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

function getDetails(res) {
    //console.log(res.moves);
    pokeImg.src = res.sprites.front_default;
    nameId[0].innerText = res.id;
    const name = res.name;
    nameId[1].innerText = name.charAt(0).toUpperCase() + name.slice(1);
    const moves = res.moves;
    moves.forEach(element => {
        const a = makeListElem(element.move.name, element.move.url);
        //console.log(element.move.url);
        a.onclick = (event) => {
            const api = event.target.getAttribute('data-source');
            getAPI(api, moveDetails);
            function moveDetails(mov) {
                const accuracy = mov.accuracy;
                const power = mov.power;
                const pp = mov.pp;
                event.target.innerHTML = `
                <ul>
                <li>Accuracy: ${accuracy}</li>
                <li>P: ower${power}</li>
                <li>PP: ${pp}</li>
                </ul>
                `
            }

        }
        movesList.appendChild(a);

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