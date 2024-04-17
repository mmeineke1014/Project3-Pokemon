
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

  //get Bargraph width and height:
  bargraph_height = document.getElementById("overview-div").clientHeight;
  bargraph_width = document.getElementById("overview-div").clientWidth;

  bargraph = new Bargraph({
    'parentElement': '#overview-bargraph',
    'containerWidth': bargraph_width,
    'containerHeight': bargraph_height - 50
  }, data, "character")



    
  })
  .catch(error => console.error(error));


//Add event listeners to resize the Timeline and Bargraph:
addEventListener("resize", resizeVisualizations);

function resizeVisualizations() {
  console.log('resize event triggered');
  
  //get the new height and width for the B goal div
  bargraph.config.containerHeight = document.getElementById("overview-div").clientHeight - 50;
  bargraph.config.containerWidth = document.getElementById("overview-div").clientWidth;

  //call the update function
  bargraph.updateVis();
}