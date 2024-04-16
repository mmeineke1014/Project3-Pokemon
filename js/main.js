
d3.csv('data/pokemonDP.csv')
.then(data => {
    console.log(data[0]);
    console.log(data.length);
    data.forEach(d => {
      //console.log(d);
      d.season = +d.season;
      d.episode = +d.episode;
      d.character = d.character;
      d.line = d.line;
      d.dialogue = d.dialogue;
     

    });

//     // Initialize charts and then show it
//     OLD EXAMPLE CODE FROM LAST PROJECT
//     leafletMap = new LeafletMap({ parentElement: '#my-map'}, data);



    
  })
  .catch(error => console.error(error));

