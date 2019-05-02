


myRequest = new XMLHttpRequest();
const url = 'https://pokeapi.co/api/v2/pokemon';
let listOfNames = document.getElementsByClassName('list-group')[0];
const pokeImg = document.getElementById('pokeImg');
myRequest.onload = () => {
    const data = JSON.parse(myRequest.response);
   // console.log(data.results);
    const results = data.results;
    //console.log(results[0].url);
    results.forEach(element => {
        addPokeName(element.name, element.url);
        console.log(element.url);
    });
    if (results.length == 20) {
        const next = data.next;
        myRequest.open('GET', next);
        myRequest.send();
    }
}
myRequest.open('GET', url);
myRequest.send();

function addPokeName(name, source) {
    const a = document.createElement('a');
    const text = document.createTextNode(name);
    a.appendChild(text);
    a.classList.add('list-group-item', 'list-group-item-action');
    a.setAttribute("data-source", source);
    a.onclick = (event) => {
        const source = event.target.getAttribute('data-source');
        fetch(source)
    }
    listOfNames.appendChild(a);
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