
// Election data with vote percentages
var data = {
    'erdogan': { 'votes': 27834692, 'percentage': 52.18, 'party': 'AK' },
    'kilicdaroglu': { 'votes': 25504552, 'percentage': 47.82, 'party': 'CHP' }
  };
  
  // Party colors
  let partyColors = {
    'AK': '#ED9600',
    'CHP': '#E42538',
    'Default': '#BDC3C7'
  };
  
  // Seting the height of the bars based on the percentage and assign party colors
  d3.select("#erdogan-bar")
    .style("height", data['erdogan'].percentage + "px")
    .style("background-color", partyColors['AK']);
  
  d3.select("#kilicdaroglu-bar")
    .style("height", data['kilicdaroglu'].percentage + "px")
    .style("background-color", partyColors['CHP']);
  


let svg;
let hoverColors = {
    'AK': '#FFB347',    // Brighter and more vivid version of '#E42538'
    'CHP': '#FF4742',// Brighter and more vivid version of '#ED9600'
    'Default': '#D3D3D3' // Lighter and slightly brighter version of '#BDC3C7'
}
let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "1px solid black")
    .style("padding", "10px")
    .style("border-radius", "5px");

d3.json("http://localhost:8000/JSON_Data/merged_data.geojson").then(function(data) {
    svg = d3.select("#map").append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    let width = document.getElementById("map").clientWidth;
    let height = document.getElementById("map").clientHeight;

    let projection = d3.geoMercator()
        .fitSize([width, height], data);

    let path = d3.geoPath().projection(projection);

    let partyColors = {
        'AK': '#ED9600',
        'CHP': '#E42538',
        'Default': '#BDC3C7'
    };

    function getWinningParty(properties) {
        if (!properties) return 'Default';
        let maxPercentage = 0;
        let winningParty = 'Default';
        let parties = ['AK', 'CHP'];

        parties.forEach(function(party) {
            let percentage = properties[party];
            if (percentage && percentage > maxPercentage) {
                maxPercentage = percentage;
                winningParty = party;
            }
        });
        return winningParty;
    }

//------------------


svg.selectAll(".city-boundary")
    .data(data.features)
    .enter().append("path")
    .attr("class", "city-boundary")
    .attr("d", path)
    .attr("data-original-color", function(d) { // Storing the original color as a data attribute
        return partyColors[getWinningParty(d.properties)];
    })
    .style("fill", function(d) {
        return partyColors[getWinningParty(d.properties)];
    })
    .style("stroke", "#ffffff")
    .style("stroke-width", "1")
    .on("mouseover", function(event, d) {
        let hoverColor = hoverColors[getWinningParty(d.properties)];
        d3.select(this).style("fill", hoverColor);

        // Tooltip content
        let properties = d.properties;
        let parties = ['AK', 'CHP'];
        parties.sort((a, b) => (properties[b] || 0) - (properties[a] || 0));
        let content = `<strong>${properties.name}</strong><br/>`;
        parties.forEach(party => {
            if (properties[party]) {
                content += `${party} Party: ${(properties[party] * 100).toFixed(2)}%<br/>`;
            }
        });

        tooltip.html(content)
            .style("visibility", "visible")
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");

    })
    .on("mouseout", function() {
        let originalColor = d3.select(this).attr("data-original-color"); // Retrieving the original color
        d3.select(this).style("fill", originalColor);

        tooltip.style("visibility", "hidden");
    });


//------------------


    svg.selectAll(".city-name")
        .data(data.features)
        .enter().append("text")
        .attr("class", "city-name")
        .attr("x", function(d) {
            return path.centroid(d)[0];
        })
        .attr("y", function(d) {
            return path.centroid(d)[1];
        })
        .text(function(d) {
            return d.properties.name.substring(0, 3).toUpperCase();
        })
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "white");

}).catch(function(error) {
    console.log("Error loading GeoJSON data:", error);
});




//-------------------------------------


// Dimensions and margins for the graph
const margin = { top: 10, right: 20, bottom: 30, left: 55 }; // Increasing left margin so the $ symbol shows

const chartWidth = 325 - margin.left - margin.right; // Uniform width
const chartHeight = 300 - margin.top - margin.bottom; // Uniform height

// Append SVG object to the body of the page and set its dimensions
const svg1 = d3.select("#gdpChart")
  .append("svg")
    .attr("width", chartWidth + margin.left + margin.right )
    .attr("height", chartHeight + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Title of the plot
svg1.append("text")
  .attr("x", chartWidth / 2) // Position in the center of the x-axis
  .attr("y", chartHeight / 1.5) // Position at the bottom with margin adjustment
  .attr("text-anchor", "middle")  
  .style("font-size", "16px") 
  .style("color", "green")  
  .text("GDP Per Capita");


// Load and plot GDP per capita data
d3.json("http://localhost:8000/JSON_Data/gdp-per-capiatstatistic_id263599_gross-domestic-product--gdp--per-capita-in-turkey-2028.json").then(data => {
  //=data for the years 2021 to 2024
  const filteredData = data.filter(d => d.Year >= 2021 && d.Year <= 2024);

// Adjust the xScale domain to start from 0
const xScale = d3.scaleBand()
    .domain(filteredData.map(d => d.Year))
    .range([0, chartWidth])
    .padding(0); 


// Define the yScale as a linear scale
const yScale = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => +d['GDP/Capita'])])
    .range([chartHeight, 10]); // Adjust the padding value here

  // Add the X axis
  svg1.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));

      

  // Y axis with dollar symbol

  svg1.append("g")
  .call(d3.axisLeft(yScale).tickFormat(d => `$${d3.format(",")(Math.round(d))}`))
  .selectAll(".tick text")
  .style("text-anchor", "end");


svg1.selectAll(".tick text") // Adjust the class name if necessary
  .style("font-size", "12px")

  // line path for the GDP per capita
  svg1.append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
          .x(d => xScale(d.Year) + xScale.bandwidth() / 2) // Center the line in the band
          .y(d => yScale(d['GDP/Capita']))
      );

  // vertical line that will show on hover
  const hoverLine = svg1.append("line")
      .attr("stroke", "#000")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", chartHeight)
      .attr("opacity", 0); // Initially hidden

  // Create and append div for the GDP tooltip
  const gdpTooltip = d3.select("body").append("div")
      .attr("class", "gdpTooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #000")
      .style("padding", "5px");

  // Append mouseover event listener for svg1
  svg1.append("rect")
    .attr("class", "overlay")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .style("opacity", 0) // Set to transparent to capture mouse events
    .on("mouseover", function() {
      hoverLine.attr("opacity", 1); // Show the vertical line on mouseover
      gdpTooltip.style("opacity", 1); // Show the tooltip on mouseover
    })
    .on("mouseout", function() {
      hoverLine.attr("opacity", 0); // Hide the vertical line on mouseout
      gdpTooltip.style("opacity", 0); // Hide the tooltip on mouseout
    })
    .on("mousemove", function(event) {
      // Get the x position of the mouse relative to the SVG
      const mouseX = d3.pointer(event, this)[0];

      // Find the nearest band index based on the mouse position
      const bandIndex = Math.round((mouseX - margin.left) / (chartWidth / filteredData.length));
      const index = Math.min(filteredData.length - 1, Math.max(0, bandIndex));
      const nearestDataPoint = filteredData[index];

      // Position the vertical line at the center of the nearest data point's band
      hoverLine.attr("x1", xScale(nearestDataPoint.Year) + xScale.bandwidth() / 2)
               .attr("x2", xScale(nearestDataPoint.Year) + xScale.bandwidth() / 2);

      // Set the content and position of the tooltip
      gdpTooltip.html(`Year: ${nearestDataPoint.Year}<br/>GDP/Capita: $${d3.format(",.2f")(nearestDataPoint['GDP/Capita'])}`)
                .style("left", `${event.pageX + 15}px`)
                .style("top", `${event.pageY - 28}px`);
    });

});





// Inflation Chart SVG2
const svg2 = d3.select("#inflationChart")
    .append("svg")
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

// Title of the plot
svg2.append("text")
    .attr("x", chartWidth / 2)             
    .attr("y", chartHeight / 1.5)
    .attr("text-anchor", "middle")  
    .style("font-size", "16px")  
    .text("Inflation CPI");

// Load and plot inflation data
d3.json("http://localhost:8000/JSON_Data/inflation_statistic_id895080_year-on-year-change-in-cpi-in-turkey-2016-2024.json").then(data => {
    // Convert timestamp to date and filter data from Mar 2023 to Mar 2024
    const startPeriod = new Date("2023-04-01").getTime();
    const endPeriod = new Date("2024-04-01").getTime();
    const filteredInflationData = data.filter(d => d.Month >= startPeriod && d.Month < endPeriod)
                                      .map(d => ({ Date: new Date(d.Month), Percentage: d.Percentage }));

    // Define xScale as a time scale
    const xScaleInflation = d3.scaleTime()
        .domain(d3.extent(filteredInflationData, d => d.Date))
        .range([0, chartWidth]);

    // Define yScale as a linear scale
    const yScaleInflation = d3.scaleLinear()
        .domain([30, d3.max(filteredInflationData, d => d.Percentage)])
        .range([chartHeight, 0]);



        
 // Assuming your filteredInflationData array is already sorted by date...
const everyOtherMonthStartingSecond = filteredInflationData
.filter((d, i) => (i + 1) % 2 === 0) // Start with the second data point
.map(d => d.Date); // Extract just the date for the tick values

svg2.append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(d3.axisBottom(xScaleInflation)
      .tickValues(everyOtherMonthStartingSecond)
      .tickFormat(function(d) {
          // Display full month name for January, abbreviated for others
          return d3.timeFormat(d.getMonth() === 0 ? "%b %y" : "%b")(d);
      })
  );

// Optional: Increase the font size of the x-axis tick labels
svg2.selectAll(".tick text") // Adjust the class name if necessary
  .style("font-size", "12px");


    // Add Y axis with '%' symbol
    svg2.append("g")
        .call(d3.axisLeft(yScaleInflation).tickFormat(d => `${d}%`));

    // Add the line path
    svg2.append("path")
        .datum(filteredInflationData)
        .attr("fill", "none")
        .attr("stroke", "orange")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => xScaleInflation(d.Date))
            .y(d => yScaleInflation(d.Percentage))
        );

    // Create and append div for the inflation tooltip
    const inflationTooltip = d3.select("body").append("div")
        .attr("class", "gdpTooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #000")
        .style("padding", "5px");
   
    
    // Append mouseover event listener for svg2
    svg2.append("rect")
        .attr("class", "overlay")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .style("opacity", 0) // Set to transparent to capture mouse events
        .on("mouseover", function() {
            hoverLine2.attr("opacity", 1); // Show the vertical line on mouseover
            inflationTooltip.style("opacity", 1); // Show the tooltip on mouseover
        })
        .on("mouseout", function() {
            hoverLine2.attr("opacity", 0); // Hide the vertical line on mouseout
            inflationTooltip.style("opacity", 0); // Hide the tooltip on mouseout
        })
        .on("mousemove", function(event) {
            // Get the x position of the mouse relative to the SVG
            const mouseX = d3.pointer(event, this)[0];

            // Find the nearest data point based on the mouse position
            const bisectDate = d3.bisector(d => d.Date).left;
            const index = bisectDate(filteredInflationData, xScaleInflation.invert(mouseX), 1);
            const d0 = filteredInflationData[index - 1];
            const d1 = filteredInflationData[index];
            const d = xScaleInflation.invert(mouseX) - d0.Date > d1.Date - xScaleInflation.invert(mouseX) ? d1 : d0;

            // Position the vertical line at the x-coordinate of the mouse
            hoverLine2.attr("x1", xScaleInflation(d.Date))
                .attr("x2", xScaleInflation(d.Date));

            // Set the content and position of the tooltip
            inflationTooltip.html(`Date: ${d3.timeFormat("%b %Y")(d.Date)}<br/>Percentage: ${d.Percentage.toFixed(2)}%`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 10}px`);
        });

    // Add the vertical line for hover effect
    const hoverLine2 = svg2.append("line")
        .attr("stroke", "#000")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", chartHeight)
        .attr("opacity", 0); // Initially hidden
});

//------------------------ Exchange Rate Chart -------------------------



// Exchange Rate Chart
const svg3 = d3.select("#exchangeRateChart")
    .append("svg")
    .attr("width", chartWidth + margin.left + margin.right)
    .attr("height", chartHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);



// Title of the plot
svg3.append("text")
    .attr("x", chartWidth / 2)             
    .attr("y", chartHeight / 1.5)
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .text("USD to Turkish");

// Load and plot exchange rate data
d3.json("http://localhost:8000/JSON_Data/usd_to_lira_statista.json").then(data => {
    // Parse dates and filter data from Mar 1, 2023, to Apr 5, 2024
    const startDate = new Date("2023-04-01");
    const endDate = new Date("2024-04-05");
    let exchangedData = data.filter(d => {
        const day = new Date(d.DAY);
        return day >= startDate && day <= endDate;
    }).map(d => ({ Date: new Date(d.DAY), Rate: d.RATE }));

console.log(exchangedData)

    
    // Grouping data by month and calculate the mean rate for each month
    const monthFormat = d3.timeFormat("%b %y"); // Formating to display abbreviated month and year
    const ratesByMonth = {};

    exchangedData = exchangedData.map(d => {
        const month = monthFormat(d.Date);
        if (!ratesByMonth[month]) {
            ratesByMonth[month] = { sum: 0, count: 0 };
        }
        ratesByMonth[month].sum += d.Rate;
        ratesByMonth[month].count += 1;
        return d; // Returning the modified data point
    });
    



    const monthlyMeans = Object.keys(ratesByMonth).map(month => {
        return {
            Date: d3.timeParse("%b %y")(month),
            MeanRate: ratesByMonth[month].sum / ratesByMonth[month].count
        };
    });



   console.log(monthlyMeans)

   // Defining scales
   const xScaleExchange = d3.scaleTime()
   .domain(d3.extent(monthlyMeans, d => d.Date))
   .range([0, chartWidth]);

   const yScaleExchange = d3.scaleLinear()
   .domain([0, d3.max(monthlyMeans, d => d.MeanRate)]) // Using MeanRate here
   .range([chartHeight, 0]);


   const everyOtherMonth = monthlyMeans.filter((d, i) => i % 2 !== 0).map(d => d.Date);

   // Adding X axis with custom tick formatting
   svg3.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScaleExchange)
          .tickValues(everyOtherMonth)
          .tickFormat(d => {
              // Format for January includes the year, others just the month
              return d3.timeFormat(d.getMonth() === 0 ? "%b %y" : "%b")(d);
          })
      );

// Adding Y axis with Turkish Lira symbol '₺'
svg3.append("g")
   .call(d3.axisLeft(yScaleExchange).tickFormat(d => `₺${d.toFixed(2)}`));

// Adding the line path
svg3.append("path")
    .datum(monthlyMeans)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .defined(d => !isNaN(d.MeanRate)) // Ensureing the MeanRate is a number
        .x(d => xScaleExchange(d.Date))
        .y(d => yScaleExchange(d.MeanRate)) // Useing MeanRate here
    );

    

svg3.selectAll(".tick text") // Adjusting the class name if necessary
.style("font-size", "12px")

// Tooltip setup
const exchangeTooltip = d3.select("body").append("div")
   .attr("class", "gdpTooltip")
   .style("opacity", 0)
   .style("position", "absolute")
   .style("background", "#fff")
   .style("border", "1px solid #000")
   .style("padding", "5px");

// Hover Line
const hoverLine3 = svg3.append("line")
   .attr("stroke", "#000")
   .attr("x1", 0)
   .attr("x2", 0)
   .attr("y1", 0)
   .attr("y2", chartHeight)
   .attr("opacity", 0);

// Mouseover, mouseout, and mousemove event listeners
svg3.append("rect")
   .attr("class", "overlay")
   .attr("width", chartWidth)
   .attr("height", chartHeight)
   .style("opacity", 0)
   .on("mouseover", function() {
       hoverLine3.attr("opacity", 1);
       exchangeTooltip.style("opacity", 1);
   })
   .on("mouseout", function() {
       hoverLine3.attr("opacity", 0);
       exchangeTooltip.style("opacity", 0);
   })
   .on("mousemove", function(event) {
       const mouseX = d3.pointer(event, this)[0];
       const bisectDate = d3.bisector(d => d.Date).left;
       const index = bisectDate(monthlyMeans, xScaleExchange.invert(mouseX), 1);
       const d0 = monthlyMeans[index - 1];
       const d1 = monthlyMeans[index];
       const d = xScaleExchange.invert(mouseX) - d0.Date > d1.Date - xScaleExchange.invert(mouseX) ? d1 : d0;

       // Checking if `d` and `d.MeanRate` are defined
       if (d && d.MeanRate !== undefined) {
            hoverLine3.attr("x1", xScaleExchange(d.Date))
                .attr("x2", xScaleExchange(d.Date));

            exchangeTooltip.html(`Date: ${d3.timeFormat("%b %Y")(d.Date)}<br/>Rate: ₺${d.MeanRate.toFixed(2)}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 10}px`);
        }
   });
});

