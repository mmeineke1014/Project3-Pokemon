class BarChartRace {
  constructor(chartId, extendedSettings) {
    this.chartSettings = {
      width: 500,
      height: 400,
      padding: 40,
      titlePadding: 5,
      columnPadding: 0.4,
      ticksInXAxis: 5,
      duration: 3500,
      ...extendedSettings
    };
    this.containerId = "bar-chart-container";

    this.chartSettings.innerWidth = this.chartSettings.width - this.chartSettings.padding * 2;
    this.chartSettings.innerHeight = this.chartSettings.height - this.chartSettings.padding * 2;

    this.chartDataSets = [];
    this.chartTransition;
    this.timerStart;
    this.timerEnd;
    this.currentDataSetIndex = 0;
    this.elapsedTime = this.chartSettings.duration;
    this.xAxisScale = d3.scaleLinear().range([0, this.chartSettings.innerWidth]);
    this.yAxisScale = d3.scaleBand().range([this.chartSettings.innerHeight, 0]).padding(0.1);
   

    // Append SVG element to the container
    console.log(`#${this.containerId}`)
        this.svg = d3.select(`#${this.containerId}`)
        .append("svg")
        .attr("id", "bar-chart-race-svg")
        .attr("width", this.chartSettings.width)
        .attr("height", this.chartSettings.height);
  
      // Append chart container group to the SVG
      this.chartContainer = this.svg.append("g")
        .attr("class", "chart-container")
        .attr("transform", `translate(${this.chartSettings.padding}, ${this.chartSettings.padding})`);
  
      // Append x-axis group
      this.xAxisContainer = this.chartContainer.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${this.chartSettings.innerHeight})`);
  
      // Append y-axis group
      this.yAxisContainer = this.chartContainer.append("g")
        .attr("class", "y-axis");
  
      // Append columns group
      this.columnsContainer = this.chartContainer.append("g")
        .attr("class", "columns");
  
      // Append chart title
      this.chartContainer.append("text")
        .attr("class", "chart-title")
        .attr("x", this.chartSettings.width / 2)
        .attr("y", this.chartSettings.padding / 2)
        .attr("text-anchor", "middle")
        .text("Chart Title");
  
      // Append current date text
      this.chartContainer.append("text")
        .attr("class", "current-date")
        .attr("x", this.chartSettings.innerWidth)
        .attr("y", this.chartSettings.innerHeight)
        .attr("text-anchor", "end")
        .text("Current Date");
  }

  draw({ episode, dataSet }, transition) {
    const { innerHeight, titlePadding } = this.chartSettings;
    // Log the characters array
   // Extract characters from dataSet
   const characters = dataSet;

   // Log the characters array to verify
   console.log("Characters array:", characters);

   this.xAxisScale.domain([0, d3.max(characters, d => d.value)]);
   this.yAxisScale.domain(characters.map(d => d.name));

    const barGroups = this.chartContainer
      .select(".columns")
      .selectAll("g.column-container")
      .data(characters, d => d.name);

    const barGroupsEnter = barGroups
      .enter()
      .append("g")
      .attr("class", "column-container")
      .attr("transform", `translate(0,${innerHeight})`);

    barGroupsEnter
      .append("rect")
      .attr("class", "column-rect")
      .attr("width", 0)
      .attr("height", this.yAxisScale.step() * (1 - this.chartSettings.columnPadding));

    barGroupsEnter
      .append("text")
      .attr("class", "column-title")
      .attr("y", (this.yAxisScale.step() * (1 - this.chartSettings.columnPadding)) / 2)
      .attr("x", -titlePadding)
      .text(({ name }) => name);

    barGroupsEnter
      .append("text")
      .attr("class", "column-value")
      .attr("y", (this.yAxisScale.step() * (1 - this.chartSettings.columnPadding)) / 2)
      .attr("x", titlePadding)
      .text(0);

    const barUpdate = barGroupsEnter.merge(barGroups);

    barUpdate
      .transition(transition)
      .attr("transform", ({ name }) => `translate(0,${this.yAxisScale(name)})`)
      .attr("fill", "normal");

    barUpdate
      .select(".column-rect")
      .transition(transition)
      .attr("width", ({ value }) => this.xAxisScale(value));

    barUpdate
      .select(".column-title")
      .transition(transition)
      .attr("x", ({ value }) => this.xAxisScale(value) - titlePadding);

    barUpdate
      .select(".column-value")
      .transition(transition)
      .attr("x", ({ value }) => this.xAxisScale(value) + titlePadding)
      .tween("text", ({ value }) => {
        const interpolateStartValue =
          this.elapsedTime === this.chartSettings.duration
            ? this.currentValue || 0
            : +this.innerHTML;
    
        const interpolate = d3.interpolate(interpolateStartValue, value);
        this.currentValue = value;
    
        return (t) => {
          d3.select(this).text(Math.ceil(interpolate(t)));
        };
      });

    const bodyExit = barGroups.exit();

    bodyExit
      .transition(transition)
      .attr("transform", `translate(0,${innerHeight})`)
      .on("end", function() {
        d3.select(this).attr("fill", "none");
      });

    bodyExit
      .select(".column-title")
      .transition(transition)
      .attr("x", 0);

    bodyExit
      .select(".column-rect")
      .transition(transition)
      .attr("width", 0);

    bodyExit
      .select(".column-value")
      .transition(transition)
      .attr("x", titlePadding)
      .tween("text", function() {
        const interpolate = d3.interpolate(this.currentValue, 0);
        this.currentValue = 0;

        return function(t) {
          d3.select(this).text(Math.ceil(interpolate(t)));
        };
      });

    return this;
  }

  addDataset(dataSet) {
    this.chartDataSets.push(dataSet);

    return this;
  }

  addDatasets(dataSets) {
    if (!Array.isArray(dataSets)) {
      console.error("DataSets must be an array.");
      return this;
    }
    
    this.chartDataSets.push(...dataSets);

    return this;
  }

  setTitle(title) {
    const svgWidth = this.chartSettings.width;
    const svgHeight = this.chartSettings.height;

    // Calculate the position of the title
    const titleX = svgWidth / 2;
    const titleY = this.chartSettings.padding / 2; // Adjust this value as needed

    d3.select(".chart-title")
        .attr("x", titleX)
        .attr("y", titleY)
        .text(title);

    return this;
}

  async render(index = 0) {
    console.log("Rendering chart for episode:", index);
    this.currentDataSetIndex = index;
    this.timerStart = d3.now();
  
    // Log the data passed to the draw function
    console.log("Data for rendering:", this.chartDataSets[index]);
  
    this.chartTransition = this.chartContainer
      .transition()
      .duration(this.elapsedTime)
      .ease(d3.easeLinear)
      .on("end", () => {
        if (index < this.chartDataSets.length) {
          console.log("Transition ended, rendering next episode...");
          this.elapsedTime = this.chartSettings.duration;
          // Render the next episode
          this.render(index + 1);
        } else {
          console.log("All episodes rendered.");
          d3.select("button").text("Play");
        }
      })
      .on("interrupt", () => {
        console.log("Transition interrupted.");
        this.timerEnd = d3.now();
      });
  
    // Draw the chart for the current episode
    if (index < this.chartDataSets.length) {
      console.log("Drawing chart for current episode...");
      this.draw(this.chartDataSets[index], this.chartTransition);
    }
  
    return this;
  }

  stop() {
    d3.select(`#${this.chartId}`)
      .selectAll("*")
      .interrupt();

    return this;
  }

  start() {
    this.elapsedTime -= this.timerEnd - this.timerStart;

    this.render(this.currentDataSetIndex);

    return this;
  }
}