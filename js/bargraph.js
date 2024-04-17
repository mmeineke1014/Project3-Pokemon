class Bargraph {
    constructor(_config, _data, _category){
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 750,
            containerHeight: _config.containerHeight || 250,
            margin: { top: 30, right: 10, left: 70, bottom: 60 },
            tooltipPadding: _config.tooltipPadding || 15  
        }
    
        this.data = _data;
        this.category = _category;

        this.initVis();
    }

    initVis(){
        console.log('Draw Bargraph');

        let vis = this;
        
        // Define 'svg' as a child-element (g) from the drawing area and include spaces
        // Add <svg> element (drawing space)
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
        
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

        //define Initial Scales
        let timeframe = d3.extent(vis.data, d => d.dateobject);
        console.log(timeframe[0], timeframe[1]);

        // Define temp X Scale
        vis.xScale = d3.scaleLinear()
                        .domain([0, 10])
                        .range([0, 10]);

        //Define temp Y Scale
        vis.yScale = d3.scaleLinear()
                        .domain([10, 0])
                        .range([10, 0]);

        //Draw the axes
        vis.xAxisGroup = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr("transform", "translate(0," + vis.height + ")") 
            .call(d3.axisBottom(vis.xScale));
            
        vis.yAxisGroup = vis.chart.append('g')
            .attr('class', 'axis y-axis')
            .call(d3.axisLeft(vis.xScale)); 
            
        //label the axes
        vis.yAxisLabel = vis.chart.append('text')
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -45)
            .attr("x", -1 * (vis.config.containerHeight / 4))
            .attr("transform", "rotate(-90)")
            .text("count");

        vis.xAxisLabel = vis.chart.append('text')
            .attr('class', 'x label')
            .attr("text-anchor", "end")
            .attr("x", vis.width/2)
            .attr("y", vis.height + vis.config.margin.top)
            .text("Characters");

        //call updateVis() to finish rendering the timeline
        vis.updateVis();    
    }

    updateVis(){
        let vis = this;

        //delete the old axes
        vis.xAxisGroup.remove();
        vis.yAxisGroup.remove();
        vis.xAxisLabel.remove()


        //Calculate the height and width of the visualizations, factoring margins              
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        
        console.log('width', vis.width);
        console.log('height', vis.height);

        //Redefine the SVG
                
        // Define 'svg' as a child-element (g) from the drawing area and include spaces
        // Add <svg> element (drawing space)
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        
        // get the buckets and counts depending on the category
        let values, counts, x;

        console.log(this.generateBands())
        x = this.generateBands();

        values = x[0];
        counts = x[1];

        //Redefine the scales
        vis.xScale = d3.scaleBand()
            .domain(values)
            .range([3, vis.width])
            .padding(0.2); 

        
        let maxCount = Math.max(...Object.values(counts));
        vis.yScale = d3.scaleLinear()
            .domain([0, maxCount])
            .range([vis.height, 0]);

        //Redraw the Axes
        vis.xAxisGroup = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.xScale));
                
        vis.yAxisGroup = vis.chart.append('g')
            .attr('class', 'axis y-axis')
            .call(d3.axisLeft(vis.yScale));

        vis.xAxisGroup.selectAll("text")
                            .attr('transform', 'rotate(25)')

        //If the category is encounter length, add an x-axis label
        /*
        if(vis.category == "encounter_length"){
            vis.xAxisLabel = vis.chart.append('text')
                .attr('class', 'x label')
                .attr("text-anchor", "end")
                .attr("x", vis.width/2 + vis.config.margin.left)
                .attr("y", vis.height + vis.config.margin.bottom - 10)
                .text("Encounter Length (in seconds)");
        }
        */

        //Plot the data on the Chart
        //Draw the bars
        vis.chart.selectAll('rect')
        .data(values)
            .join('rect')
                .attr('class', 'bar')
                .attr('fill', 'MidnightBlue')
                .attr('width', vis.xScale.bandwidth())
                .attr('height', val => vis.height - vis.yScale(counts[val]))
                .attr('y', val => vis.yScale(counts[val]))
                .attr('x', val => vis.xScale(val));
        }

    renderVis(){
    }

    generateBands(){
        let values = [];
        let counts = {};

        this.data.forEach(d => {
            //console.log(d[this.category]);
            //check if the the data points value is already in the values array
            if(values.includes(d[this.category])){
                // if so, increment the count for that value
                counts[d[this.category]]++;
            }
            else{
                //otherwise, add the value to the counts dictionary with a count of 1
                counts[d[this.category]] = 1;
                values.push(d[this.category]);
            }
        });

        return [values, counts];
    }
}