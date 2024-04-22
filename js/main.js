let heatmap


function generateDataTable(data) {
  // Initialize an object to store cumulative totals for each character
  const characterTotals = {};

  // Calculate cumulative totals for each character
  data.forEach(dialogueLine => {
      const character = dialogueLine.character;
      
      // Update cumulative total for the character
      characterTotals[character] = (characterTotals[character] || 0) + 1;
  });

  // Sort characters by cumulative total in descending order
  const sortedCharacters = Object.entries(characterTotals)
      .sort(([, totalA], [, totalB]) => totalB - totalA);

  // Create a table element
  const table = document.createElement('table');

  // Create the table header
  const header = table.createTHead();
  const headerRow = header.insertRow();
  const headerCell1 = document.createElement('th');
  headerCell1.textContent = 'Character';
  headerRow.appendChild(headerCell1);
  const headerCell2 = document.createElement('th');
  headerCell2.textContent = 'Cumulative Total';
  headerRow.appendChild(headerCell2);

  // Create the table body
  const body = table.createTBody();
  sortedCharacters.forEach(([character, total], index) => {
      const row = body.insertRow();
      const cell1 = row.insertCell();
      cell1.textContent = character;
      const cell2 = row.insertCell();
      cell2.textContent = total;

      // Apply alternating row shading to table cells
      if (index % 2 === 0) {
          cell1.style.backgroundColor = '#f2f2f2'; // Light gray background color
          cell2.style.backgroundColor = '#f2f2f2'; // Light gray background color
      }
  });

  // Create a container div to hold the table
  const container = document.createElement('div');

  // Apply CSS to position the container within the bar chart container
  const barChartContainer = document.getElementById('bar-chart-container');
  const offsetLeft = barChartContainer.getBoundingClientRect().left;
  const offsetTop = barChartContainer.getBoundingClientRect().top;
  container.style.position = 'absolute';
  container.style.top = offsetTop + 'px';
  container.style.right = offsetLeft + 'px';
  container.style.padding = '20px'; // Optional: Add padding for spacing
  container.style.maxWidth = '500px'; // Limit the container width to 500 pixels
  container.style.height = '460px'; // Set a fixed height for the container
  container.style.maxHeight = '460px'; // Limit the container height to 600 pixels
  container.style.overflow = 'auto'; // Add vertical scrollbar when content exceeds the height

  // Append the table to the container
  container.appendChild(table);

  return container;
}

d3.csv('data/pokemonDP.csv')
  .then(data => {

    // Generate the data table
    const dataTable = generateDataTable(data);
    const dataTableContainer = document.getElementById("bar-chart-container");
    dataTableContainer.appendChild(dataTable);

    
    // Data preprocessing and generation
    const dataSets = generateDataSets(data);
    

    // Create and render the bar chart race
    const chart = new BarChartRace("chart", { /* extended settings */ }) // Instantiate the BarChartRace class
      .addDatasets(dataSets)
      .render();

    heatmapHeight = document.getElementById("heatmap_div").clientHeight;
    heatmapWidth = document.getElementById("heatmap_div").clientWidth;

    heatmap = new Heatmap({
        'parentElement': "#heatmap",
        "containerWidth": heatmapWidth,
        "containerHeight": heatmapHeight
    }, data, "ASH");
  })
  .catch(error => {
    console.error("Error loading the CSV file:", error);
  });

  addEventListener("resize", resizeVisualizations);

  document.getElementById("ASH").addEventListener("click", onButtonClick);
  document.getElementById("PIKACHU").addEventListener("click", onButtonClick);
  document.getElementById("DAWN").addEventListener("click", onButtonClick);
  document.getElementById("BROCK").addEventListener("click", onButtonClick);
  document.getElementById("JESSIE").addEventListener("click", onButtonClick);
  document.getElementById("JAMES").addEventListener("click", onButtonClick);
  document.getElementById("MEOWTH").addEventListener("click", onButtonClick);
  document.getElementById("PAUL").addEventListener("click", onButtonClick);
  document.getElementById("ZOEY").addEventListener("click", onButtonClick);
  document.getElementById("BARRY").addEventListener("click", onButtonClick);


  function resizeVisualizations(){
    console.log("RESIZE")

    heatmap.config.containerHeight = document.getElementById("heatmap_div").clientHeight;
    heatmap.config.containerWidth = document.getElementById("heatmap_div").clientWidth;

    heatmap.updateVis();
  }

  function onButtonClick(event){
    //console.log(event);
    var newCharacter = event.target.id
    console.log(newCharacter);
    
    //update the character for the Heatmap
    heatmap.character = newCharacter;
    heatmap.updateVis();

    //Update the character info
    document.getElementById("characterName").innerHTML = event.target.alt;

  }
  
  function generateDataSets(data) {
    // Group data by season and episode
    const groupedData = d3.rollup(
        data,
        v => ({
            totalCount: v.length, // Total count of lines in the episode
            characters: d3.rollup(
                v,
                v => v.length, // Count occurrences of each character in the episode
                d => d.character
            )
        }),
        d => d.season, // Use the season column to group data
        d => d.episode
    );

    // Convert grouped data into an array of objects
    const allSeasons = Array.from(groupedData)
        .sort((a, b) => a[0] - b[0]) // Sort seasons numerically
        .map(([season, episodeData]) => {
            // Initialize total dialogue line count for the season
            let seasonTotalLines = 0;

            // Convert episode data into an array of objects
            const episodes = Array.from(episodeData)
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0])) // Sort episodes numerically
                .map(([episode, { totalCount, characters }]) => {
                    // Increment total dialogue line count for the season
                    seasonTotalLines += totalCount;

                    // Filter characters to include only specified names (case-insensitive)
                    const filteredCharacters = new Map(
                        Array.from(characters).filter(([characterName]) =>
                            ["ash", "dawn", "brock", "jessie", "james", "meowth", "paul", "zoey", "barry", "pikachu"].includes(characterName.toLowerCase()))
                    );

                    return {
                        season: season,
                        episode: episode,
                        totalCount: seasonTotalLines, // Total dialogue line count up to this episode in the season
                        dataSet: Array.from(filteredCharacters, ([character, count]) => ({
                            name: character,
                            value: count // Count represents the dialogue line count for this character in this episode
                        }))
                    };
                });

            return {
                season: season,
                episodes: episodes
            };
        });

    // Combine all seasons into one big overarching dataset
    const allEpisodes = allSeasons.reduce((acc, season) => acc.concat(season.episodes), []);

    // Log the total dialogue line count for all episodes
    const totalLinesAllEpisodes = allEpisodes.reduce((acc, episode) => acc + episode.totalCount, 0);
    console.log("Total dialogue line count for all episodes:", totalLinesAllEpisodes);

    console.log(allEpisodes);
    return allEpisodes;
    return allEpisodes;
    }