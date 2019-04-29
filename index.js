myRequest = new XMLHttpRequest();
const url = 'https://pokeapi.co/api/v2/pokemon';
let listOfNames = document.getElementsByClassName('list-group')[0];

myRequest.onload = () => {
    const data = JSON.parse(myRequest.response);
    //console.log(data.results);
    const results = data.results;
    results.forEach(element => {
        addPokeName(element.name);
    });
    if (results.length == 20) {
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
const inputPoke = document.getElementsByClassName('form-control')[0];
inputPoke.oninput = () => {
    const allNames = listOfNames.children;
    for (let i = 0; i < allNames.length; i++) {
        let name = allNames[i].innerText;
        let inputValue = inputPoke.value;
        var search = name.toUpperCase().indexOf(inputValue.toUpperCase());
        console.log(search);
        if (search > -1) {
            allNames[i].style.display = "";
        } else {
            allNames[i].style.display = "none";
        }
    }
}