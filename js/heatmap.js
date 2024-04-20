class Heatmap {
    constructor(_config, _data, _character ){
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 750,
            containerHeight: _config.containerHeight || 500,
            margin: {top: 40, right: 50, bottom: 10, left: 50},
            tooltipPadding: _config.tooltipPadding || 15  
        }

        this.data = _data;
        this.character = _character;

        console.log(this.character);

        this.initVis();
    }

    initVis(){
        let vis = this;
        console.log("INIT HEATMAP");


        // Define 'svg' as a child-element (g) from the drawing area and include spaces
        // Add <svg> element (drawing space)
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

        // Initialize the scales
        //Graph Scales:
        vis.xScale = d3.scaleBand()
                            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
                            .range([0, 1])
                            .paddingInner(0.075);

        vis.yScale = d3.scaleBand()
                            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
                            .range([0, 1])
                            .paddingInner(0.075);

        //Color Scales:
        vis.s10Scale = d3.scaleLinear()
                            .domain([0,1])
                            .range(["#FFFFFF", "#44000b"])
                            .interpolate(d3.interpolateHcl);

        vis.s11Scale = d3.scaleLinear()
                            .domain([0,1])
                            .range(["#FFFFFF","#2b0044"])
                            .interpolate(d3.interpolateHcl);

        vis.s12Scale = d3.scaleLinear()
                            .domain([0,1])
                            .range(["#FFFFFF","#002544"])
                            .interpolate(d3.interpolateHcl);

        vis.s13Scale = d3.scaleLinear()
                            .domain([0,1])
                            .range(["#FFFFFF", "#004412"])
                            .interpolate(d3.interpolateHcl);

        vis.xAxisLabel = vis.chart.append('text')
                            .attr('class', 'x label')
                            .attr("text-anchor", "end")
                            .attr("x", 0)
                            .attr("y", 0)
                            .text("Episode Appearences");

        vis.updateVis()
    }

    updateVis(){
        console.log("UPDATE VIS")
        let vis = this;

        vis.xAxisLabel.remove();

       //Calculate the height and width of the visualizations, factoring margins              
       vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
       vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Define 'svg' as a child-element (g) from the drawing area and include spaces
        // Add <svg> element (drawing space)
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        //update the scales
        vis.xScale.range([0, vis.width])
        vis.yScale.range([0, vis.height])

        //caculate the appearence data

        var appearenceData = this.calcAppearenceIndexes();

        //Calculate stats for the total number of lines a character speakes and how many episodes they
        // appear in
        var totLines = 0;
        var totEps = 0;

        appearenceData.forEach( (d) => {
            totLines += d["charLines"];

            if(d["charLines"] > 0){
                totEps++;
            }
        })

        console.log(totLines, totEps);

        //Display those statistics on the screen
        document.getElementById("appearences").innerHTML = ("<b>Episode Appearences:</b> " + String(totEps));
        document.getElementById("numLines").innerHTML = ("<b>Lines of Dialogue:</b> " + String(totLines));

        //Label the chart
        vis.xAxisLabel = vis.chart.append('text')
            .attr('class', 'x label')
            .attr("text-anchor", "end")
            .attr("x", vis.width/1.5)
            .attr("y", -vis.config.margin.top/2)
            .text("Episode Appearences");


        //plot the data
        vis.rectangles = vis.chart.selectAll('rect')
            .data(appearenceData)
            .join('rect')
                .attr("x", d => vis.xScale(vis.calcEpisodeCoordinates(Number(d.season), Number(d.episode))[0]))
                .attr("y", d => vis.yScale(vis.calcEpisodeCoordinates(Number(d.season), Number(d.episode))[1]))
                .attr("fill", (d) => {
                    var indexVal = d.charLines / d.totLines;
                    //console.log(d.season);

                    if(Number(d.season) == 10){
                        //console.log(vis.s10Scale(indexVal));
                        return vis.s10Scale(indexVal);
                    }
                    else if(Number(d.season) == 11){
                        //console.log(vis.s11Scale(indexVal));
                        return vis.s11Scale(indexVal);
                    }
                    else if(Number(d.season) == 12){
                        //console.log(vis.s12Scale(indexVal));
                        return vis.s12Scale(indexVal);
                    }
                    else{
                        //console.log(vis.s13Scale(indexVal));
                        return vis.s13Scale(indexVal);
                    }
                })
                .attr("width", vis.xScale.bandwidth())
                .attr("height", vis.yScale.bandwidth())
                .attr('rx', 4)
                .attr('ry', 4);
    
        vis.rectangles
          .on('mouseover', (event, d) => {
            console.log("mouse over! ");
            console.log(event);
            console.log(d);
          
          d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY - 75) + 'px')
            .html(`
                <div class="tooltip-title">Season: ${d.season}, Episode: ${d.episode}</div>
                <ul>
                    <li>Lines spoken by this character: ${d.charLines}</li>
                    <li>Percentage of lines in episode: ${((d.charLines / d.totLines) * 100).toFixed(1)}</li>
                </ul>
            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        });
    
    }

    calcEpisodeCoordinates(season, episode){
        let x, y, total;
        if( season == 10 ){
            total = episode;
        }
        else if(season == 11){
            total = episode + 52;
        }
        else if(season == 12){
            total = episode + 52 + 52;
        }
        else{
            total = episode + 52 + 52 + 53;
        }
        
        //console.log(season, episode, total)
        total = total - 1 // subtract one so episode 1 is (0,0)

        x = total % 14;
        y = Math.floor(total/14);

        //console.log(season, episode, x, y)

        return [x,y]
    }

    calcAppearenceIndexes(){
        //Need to create array of objects that has season, episode, and appearence index for the character
        
        var indexes = {}
        var appearenceData =[]
        var indexString = "";

        this.data.forEach( (d) => {
            // check if an object with the season and episode is in the array
            indexString = String(d.season) + " " + String(d.episode);
            if(Object.keys(indexes).includes(indexString)){
                // if so, increment the total line count
                appearenceData[indexes[indexString]]["totLines"]++;
            }
            else{
                // if not add the object with total line count of 1
                appearenceData.push({
                    "season": d.season,
                    "episode": d.episode,
                    "totLines": 1,
                    "charLines": 0
                })

                indexes[indexString] = appearenceData.length - 1
            }
            
            // check if the speaker is the character, if so increment the character line count
            if(d.character == this.character || d.character.includes(" " + this.character)
                || d.character.includes(this.character + ",")){
                appearenceData[indexes[indexString]]["charLines"]++;
            }
        })

        return appearenceData;
    }
}