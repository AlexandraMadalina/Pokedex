async function fetchAPI(source) {
    const ress = await fetch(source);
    const data = await ress.json();
    console.log(data);
   return data;
}

let url = 'https://pokeapi.co/api/v2/pokemon';
async function go(){
    
    const result = await fetchAPI(url);
    console.log(result.results);
    
    if(result.results == 20){
        url = result.next;
        go();
    }
  

}
go();