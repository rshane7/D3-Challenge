// This script is for the required portion of the homework.

// This first section sets up the chart area
// Define svg element width and height

var svgWidth = 900;
var svgHeight = 450;

// Define margins
var margin = {
  top: 25,
  right: 50,
  bottom: 50,
  left: 75
};

// Define chart width and height using margins
var chartW = svgWidth - margin.left - margin.right;
var chartH = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper within the scatter element, append to the Chart group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create chart group to hold the chart
var chartGrp = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// This next section reads in the data and creates the chart

// Read in data from csv file
//d3.csv("./assets/data/data.csv").then(function(healthData) {
    d3.csv("./assets/data/data.csv").then(function(healthData) {
    var stateAbbreviation = healthData.map(data => data.abbr);
  
    // convert strings to numeric
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    // Define x and y scales based on the poverty and healthcare data

    // Adding 2 to the maximum to extend the scale to match the solution chart x-axis
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.poverty)+2])
      .range([0, chartW]);

    // Adding 2 to the maximum to extend the scale to match the solution chart y-axis
    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(healthData, d => d.healthcare)+2])
      .range([chartH, 0]);

    // Define bottom and left axis
    var bottomAxis = d3.axisBottom(xLinearScale).tickValues([10,12,14,16,18,20,22]);
    var leftAxis = d3.axisLeft(yLinearScale).tickValues([6,8,10,12,14,16,18,20,22,24,26]);
  
    // Append axes to the chart
    chartGrp.append("g")
        .attr("transform", `translate(0, ${chartH})`)
        .call(bottomAxis);
  
    chartGrp.append("g")
        .call(leftAxis);
    
    // Create circles for the scatter chart and bind the data to the elements
    var circlesGrp = chartGrp.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "9")
      .attr("fill", "lightblue")
      .attr("opacity", "1");

    // x-axis label
    chartGrp.append("text")
        .attr("transform", `translate(${chartW / 2}, ${chartH + margin.top + 15})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .attr("font-weight", "500")
        .text("In Poverty (%)");

    // y-axis label
    chartGrp.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 0)
        .attr("x", 0 - (chartH / 2 + margin.top))
        .attr("dy", "1em")
        .attr("font-size", "16px")
        .attr("font-weight", "500")
        .classed("axis-text", true)
        .text("Lack Healthcare (%)");

    // Add state abbreviations to bubbles
    // Create label variable.  
    var labelGrp = chartGrp.selectAll("label")
        .data(healthData)
        .enter()
        .append("text")
        .attr("font-size", "8px")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("font-weight", "500")
        .attr("dominant-baseline", "central")
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("x", d => xLinearScale(d.poverty))
        .classed("state-abbr", true)
        .text(d => d.abbr);
});