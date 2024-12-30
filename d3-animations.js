// Set Dimensions
const xSize = 800;
const ySize = 550;
const margin = 80;
const xMax = xSize - margin*2;
const yMax = ySize - margin*2;

// Fetch data
let yearly_sales = [
  [2019, 3.74],
  [2020, 7.31],
  [2021, 15.01],
  [2022, 19.20],
  [2023, 24.42],
  [2024, 29.96],
  [2025, 35.22],
  [2026, 40.59],
];

let yearly_revenue = [
  [2019, 3.66],
  [2020, 6.74],
  [2021, 14.20],
  [2022, 18.55],
  [2023, 23.60],
  [2024, 28.09],
  [2025, 32.69],
  [2026, 37.34],
];

let yearly_inspections = [
  [2019, 2.237],
  [2020, 3.948],
  [2021, 8.205],
  [2022, 9.333],
  [2023, 11.637],
  [2024, 12.941],
  [2025, 14.826],
  [2026, 16.853],
];

let yearly_growth = [
  [2020, 84.1],
  [2021, 110.8],
  [2022, 30.7],
  [2023, 27.2],
  [2024, 19.0],
  [2025, 16.4],
  [2026, 14.2],
]

// Append SVG Object to the Page
const svg = d3.select("#myPlot")
  .append("svg")
  .attr("height", "100%")
  .attr("width", "800px")
  .attr("class", "mt-4")
//   .style("background", "grey")
  .append("g")
  .attr("transform","translate(" + margin + "," + margin + ")");

  // Add Legend (Top Left)
const legend = svg.append("g")
.attr("class", "legend")
.attr("transform", "translate(20, 0)");  // Adjust position as needed

// Legend for Actual (Red)
legend.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("width", 20)
.attr("height", 20)
.style("fill", "red");

legend.append("text")
.attr("x", 30)
.attr("y", 15)
.text("Actual")
.style("font-size", "16px")
.attr("alignment-baseline", "middle");

// Legend for Forecast (Blue)
legend.append("rect")
.attr("x", 0)
.attr("y", 30)
.attr("width", 20)
.attr("height", 20)
.style("fill", "blue");

legend.append("text")
.attr("x", 30)
.attr("y", 45)
.text("Forecast")
.style("font-size", "16px")
.attr("alignment-baseline", "middle");

// X Axis
const x = d3.scaleBand()
    .range([0, xMax])
    .padding(0.1);



svg.append("text") // x-axis label
  .attr("x", xMax / 2)
  .attr("y", yMax + (margin/1.2))
  .attr("class", "fw-lighter")
  .style("font-size", "1.2rem")
  .style("text-anchor", "middle")
  .text("Year");


// Y Axis
const y = d3.scaleLinear()
    .range([yMax, 0]);


  
  svg.append("text") // y-axis label
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (margin * 2) - 40)
    .attr("y", 0 - (margin / 1.5))
    .style("font-size", "1.2rem")
    .style("text-anchor", "middle")
    .text("Sales (Millions)");


// Set x and y domains before rendering bars
x.domain(yearly_sales.map(d => d[0]));
y.domain([0, 50]);

// Initialize X Axis with Labels
svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${yMax})`)
  .style("font-size", "1.2rem")
  .call(d3.axisBottom(x));

svg.append("g")
  .attr("class", "y-axis")
  .style("font-size", "1.2rem")
  .call(d3.axisLeft(y));

// Create Tooltip Div
const tooltip = d3.select("#myPlot")
  .append("div")
  .style("position", "relative")
  .style("visibility", "hidden")
  .style("background", "#f9f9f9")
  .style("border", "1px solid #d3d3d3")
  .style("border-radius", "5px")
  .style("padding", "8px")
  .style("font-size", "14px")
  .style("pointer-events", "none");

// Default chart: Yearly Sales
svg.append('g')
  .selectAll(".bar")
  .data(yearly_sales)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", d => x(d[0]))
  .attr("y", d => y(d[1]))  // Correctly position the top of the bar
  .attr("width", x.bandwidth())
  .attr("height", d => yMax - y(d[1]))
  .style("fill", d => d[0] >= 2025 ? "blue" : "red")
  .style("opacity", 1)
  .on("mouseover", function(event, d) {
    console.log("Hover Data:", yearly_sales[d][1], "Million");  // This should log [year, value]
    console.log("This Element:", this);  // Logs the actual rect element
    tooltip.style("visibility", "visible")
      .text(`Year: ${yearly_sales[d][0]} | Sales: ${yearly_sales[d][1]} Million`);
    d3.select(this).style("opacity", 0.7);
  })
  .on("mousemove", function(event) {
    tooltip.style("top", (event.pageY - 20) + "px")
      .style("left", (event.pageX + 10) + "px");
  })
  .on("mouseout", function() {
    tooltip.style("visibility", "hidden");
    d3.select(this).style("opacity", 1);
  });

// Append fixed line at 0 days
// svg.append("line")
//    .attr("y1", y(d3.min(Data, (d) => d[1])))
//    .attr("y2", y(d3.max(Data, (d) => d[1])))
//    .attr("x1", x(0))
//    .attr("x2", x(0))
//    .attr("fill", "none")
//    .attr("stroke", "Grey")
//    .attr("stroke-width", 1)
//    .attr("opacity", 0.3)




// Various functions to update chart elements

function crawl_chart() {
  // Update x-axis domain to match yearly_growth data
  x.domain(yearly_sales.map(d => d[0]));

  // Update y-axis scale domain
  y.domain([0, 50]);

  //Reposition legend
  svg.select(".legend")
  .transition()
  .duration(1000)
  .attr("transform", `translate(20, 0)`);  // Move to top right

  // Redraw y-axis with animation
  svg.select(".y-axis")
    .transition()
    .duration(1000)
    .call(d3.axisLeft(y));

  // Redraw x-axis
  svg.select(".x-axis")
  .transition()
  .duration(1000)
  .call(d3.axisBottom(x));

  // Update y-axis label
  svg.select(".y-axis-label")
    .transition()
    .duration(1000)
    .text("Sales (Millions)");

  // Update bars with transition
  svg.selectAll(".bar")
    .data(yearly_sales)
    .join("rect")
    .transition()
    .duration(1000)
    .attr("class", "bar")
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d[1]))
    .attr("width", x.bandwidth())
    .attr("height", d => yMax - y(d[1]))
    .style("fill", d => d[0] >= 2025 ? "blue" : "red")
    .style("opacity", 1)

    svg.selectAll(".bar")
    .on("mouseover", function(event, d) {
      console.log("Hover Data:", yearly_sales[d][1], "Million");  // This should log [year, value]
      console.log("This Element:", this);  // Logs the actual rect element
      tooltip.style("visibility", "visible")
        .text(`Year: ${yearly_sales[d][0]} | Sales: ${yearly_sales[d][1]} Million`);
      d3.select(this).style("opacity", 0.7);
    })
    .on("mousemove", function(event) {
      tooltip.style("top", (event.pageY - 20) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("visibility", "hidden");
      d3.select(this).style("opacity", 1);
    });
}

function income_chart() {
  // Update x-axis domain to match yearly_growth data
  x.domain(yearly_revenue.map(d => d[0]));

  // Update y-axis scale domain
  y.domain([0, 50]);

  //Reposition legend
  svg.select(".legend")
  .transition()
  .duration(1000)
  .attr("transform", `translate(20, 0)`);  // Move to top right

  // Redraw y-axis with animation
  svg.select(".y-axis")
    .transition()
    .duration(1000)
    .call(d3.axisLeft(y));

  // Redraw x-axis
  svg.select(".x-axis")
  .transition()
  .duration(1000)
  .call(d3.axisBottom(x));

  // Update y-axis label
  svg.select(".y-axis-label")
    .transition()
    .duration(1000)
    .text("Revenue (Millions)");

  // Update bars with transition
  svg.selectAll(".bar")
    .data(yearly_revenue)
    .join("rect")
    .transition()
    .duration(1000)
    .attr("class", "bar")
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d[1]))
    .attr("width", x.bandwidth())
    .attr("height", d => yMax - y(d[1]))
    .style("fill", d => d[0] >= 2025 ? "blue" : "red")
    .style("opacity", 1)

  svg.selectAll(".bar")
    .on("mouseover", function(event, d) {
      console.log("Hover Data:", yearly_revenue[d][1], "Million");  // This should log [year, value]
      console.log("This Element:", this);  // Logs the actual rect element
      tooltip.style("visibility", "visible")
        .text(`Year: ${yearly_revenue[d][0]} | Revenue: ${yearly_revenue[d][1]} Million`);
      d3.select(this).style("opacity", 0.7);
    })
    .on("mousemove", function(event) {
      tooltip.style("top", (event.pageY - 20) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("visibility", "hidden");
      d3.select(this).style("opacity", 1);
    });
}


function age_chart() {
  // Update x-axis domain to match yearly_growth data
  x.domain(yearly_inspections.map(d => d[0]));

  // Update y-axis scale domain
  y.domain([0, d3.max(yearly_inspections, d => d[1])]);

  //Reposition legend
  svg.select(".legend")
  .transition()
  .duration(1000)
  .attr("transform", `translate(20, 0)`);  // Move to top right

  // Redraw y-axis with animation
  svg.select(".y-axis")
    .transition()
    .duration(1000)
    .call(d3.axisLeft(y));

  // Redraw x-axis
  svg.select(".x-axis")
  .transition()
  .duration(1000)
  .call(d3.axisBottom(x));

  // Update y-axis label
  svg.select(".y-axis-label")
    .transition()
    .duration(1000)
    .text("Inspections (Thousands)");

  // Update bars with transition
  svg.selectAll(".bar")
    .data(yearly_inspections)
    .join("rect")
    .transition()
    .duration(1000)
    .attr("class", "bar")
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d[1]))
    .attr("width", x.bandwidth())
    .attr("height", d => yMax - y(d[1]))
    .style("fill", d => d[0] >= 2025 ? "blue" : "red")
    .style("opacity", 1)

    svg.selectAll(".bar")
    .on("mouseover", function(event, d) {
      console.log("Hover Data:", yearly_inspections[d][1], "Thousand");  // This should log [year, value]
      console.log("This Element:", this);  // Logs the actual rect element
      tooltip.style("visibility", "visible")
        .text(`Year: ${yearly_inspections[d][0]} | Inspections: ${(yearly_inspections[d][1] * 1000).toLocaleString()}`);
      d3.select(this).style("opacity", 0.7);
    })
    .on("mousemove", function(event) {
      tooltip.style("top", (event.pageY - 20) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("visibility", "hidden");
      d3.select(this).style("opacity", 1);
    });
}

function growth_chart() {
  // Update x-axis domain to match yearly_growth data
  x.domain(yearly_growth.map(d => d[0]));

  // Update y-axis scale domain
  y.domain([0, d3.max(yearly_growth, d => d[1])]);

  //Reposition legend
  svg.select(".legend")
  .transition()
  .duration(1000)
  .attr("transform", `translate(${xMax - 100}, -10)`);  // Move to top right

  // Redraw y-axis with animation
  svg.select(".y-axis")
    .transition()
    .duration(1000)
    .call(d3.axisLeft(y));

  // Redraw x-axis
  svg.select(".x-axis")
  .transition()
  .duration(1000)
  .call(d3.axisBottom(x));

  // Update y-axis label
  svg.select(".y-axis-label")
    .transition()
    .duration(1000)
    .text("Annual Revenue Growth (%)");

  // Update bars with transition
  svg.selectAll(".bar")
    .data(yearly_growth)
    .join("rect")
    .transition()
    .duration(1000)
    .attr("class", "bar")
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d[1]))
    .attr("width", x.bandwidth())
    .attr("height", d => yMax - y(d[1]))
    .style("fill", d => d[0] >= 2025 ? "blue" : "red")
    .style("opacity", 1)

    svg.selectAll(".bar")
    .on("mouseover", function(event, d) {
      console.log("Hover Data:", yearly_growth[d][1], "Thousand");  // This should log [year, value]
      console.log("This Element:", this);  // Logs the actual rect element
      tooltip.style("visibility", "visible")
        .text(`Year: ${yearly_growth[d][0]} | YOY Growth: ${(yearly_growth[d][1])}%`);
      d3.select(this).style("opacity", 0.7);
    })
    .on("mousemove", function(event) {
      tooltip.style("top", (event.pageY - 20) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("visibility", "hidden");
      d3.select(this).style("opacity", 1);
    });
};