class WordCloud {
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
        this.initVis(true);
    }

        initVis(setUp){
        let vis = this;
        // List of words
        let myWords = vis.data.filter(x => x.Character == vis.character);
        console.log(myWords);

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
            width = vis.config.containerWidth - margin.left - margin.right,
            height = vis.config.containerHeight - margin.top - margin.bottom;
        // append the svg object to the body of the page
        vis.svg = d3.select("#wordcloud_div").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("style", "background-color = white")
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
        
        // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
        vis.layout = d3.layout.cloud()
          .size([width, height])
          .words(myWords.map(function(d) { return {text: d.Dialouge, amount: d.Amount}; }))
          .padding(15)
          .fontSize(20)
          .on("end", draw);
        vis.layout.start();

        function draw(words) {
          vis.svg
            .append("g")
              .attr("transform", "translate(" + vis.layout.size()[0] / 2 + "," + vis.layout.size()[1] / 2 + ")")
              .selectAll("text")
                .data(words)
              .enter().append("text")
                .style("font-size", function(d) { return Math.log2(d.amount) * 5+ "px"; })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
        }
    }

    updateVis()
    {
      let vis = this;
      vis.svg.selectAll("text").remove();

      let myWords = vis.data.filter(x => x.Character == vis.character);
        console.log(myWords);

      var margin = {top: 10, right: 10, bottom: 10, left: 10},
            width = vis.config.containerWidth - margin.left - margin.right,
            height = vis.config.containerHeight - margin.top - margin.bottom;
            console.log(width + "," + height);
      vis.layout = d3.layout.cloud()
          .size([width, height])
          .words(myWords.map(function(d) { return {text: d.Dialouge, amount: d.Amount}; }))
          .padding(15)
          .fontSize(20)
          .on("end", draw);
        vis.layout.start();

        function draw(words) {
          vis.svg
            .append("g")
              .attr("transform", "translate(" + vis.layout.size()[0] / 2 + "," + vis.layout.size()[1] / 2 + ")")
              .selectAll("text")
                .data(words)
              .enter().append("text")
                .style("font-size", function(d) { return Math.log2(d.amount) * 5 +"px"; })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
        }
    }
}
    
    