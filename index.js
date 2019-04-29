myRequest = new XMLHttpRequest();
const url = 'https://pokeapi.co/api/v2/pokemon';
let listOfNames = document.getElementsByClassName('list-group')[0];

myRequest.onload = () => {
    const data = JSON.parse(myRequest.response);
    console.log(data.results);
    const results = data.results;
    console.log(results.length);
    results.forEach(element => {
        addPokeName(element.name);
    });
    if (results.length == 20) {
        console.log(data.next);
        const next = data.next;
        myRequest.open('GET', next);
        myRequest.send();
    }
}
myRequest.open('GET', url);
myRequest.send();

function addPokeName(name) {
    const a = document.createElement('a');
    const text = document.createTextNode(name);
    a.appendChild(text);
    a.classList.add('list-group-item', 'list-group-item-action');
    listOfNames.appendChild(a);
}