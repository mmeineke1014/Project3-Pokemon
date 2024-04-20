let heatmap

d3.csv('data/pokemonDP.csv')
  .then(data => {
    // Data preprocessing and generation
    const dataSets = generateDataSets(data);

    // Create and render the bar chart race
    //const chart = new BarChartRace("chart", { /* extended settings */ }) // Instantiate the BarChartRace class
    //  .addDatasets(dataSets)
    //  .render();

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

  function resizeVisualizations(){
    console.log("RESIZE")

    heatmap.config.containerHeight = document.getElementById("heatmap_div").clientHeight;
    heatmap.config.containerWidth = document.getElementById("heatmap_div").clientWidth;

    heatmap.updateVis();
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

    // Initialize total dialogue line count
    let totalLines = 0;

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

                    return {
                        season: season,
                        episode: episode,
                        totalCount: seasonTotalLines, // Total dialogue line count up to this episode in the season
                        dataSet: Array.from(characters, ([character, count]) => ({
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

    // Calculate total dialogue line count for all episodes
    const totalLinesAllEpisodes = allEpisodes.reduce((acc, episode) => acc + episode.totalCount, 0);

    // Log the total dialogue line count for all episodes
    console.log("Total dialogue line count for all episodes:", totalLinesAllEpisodes);

    console.log(allEpisodes);
    return allEpisodes;
    }