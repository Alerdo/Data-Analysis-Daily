d3.json("Project_5 Data_Story_Telling\\turkish_cities_latin.geojson").then(function(data) {
    // Create SVG element for the map
    var svg = d3.select("#map").append("svg")
                .attr("width", "100%")
                .attr("height", "100%");

    // Get the width and height of the SVG element
    var width = document.getElementById("map").clientWidth;
    var height = document.getElementById("map").clientHeight;
  
    // Define projection
    var projection = d3.geoMercator()
                       .fitSize([width, height], data);
  
    // Define path generator
    var path = d3.geoPath().projection(projection);

    // Define a color scale for different parties
    var partyColors = {
        'AK Party': '#E74C3C',  // Red
        'CHP': '#3498DB',       // Blue
        'MHP': '#F1C40F',       // Yellow
        'Prosperity Again': '#9B59B6', // Purple
        'DEM Party': '#2ECC71', // Green
        'Default': '#BDC3C7'    // Grey for cities with no data or unrecognized party
    };

    // Function to extract the party with the highest percentage of votes
    function getWinningParty(properties) {
        // Assuming properties contains vote percentages in a specific format
        var maxPercentage = 0;
        var winningParty = 'Default';

        // Iterate over the parties to find the highest percentage
        for (var party in partyColors) {
            if (party in properties) {
                var percentage = parseFloat(properties[party].split('%')[0]);
                if (percentage > maxPercentage) {
                    maxPercentage = percentage;
                    winningParty = party;
                }
            }
        }
        return winningParty;
    }

    // Draw city boundaries
    svg.selectAll(".city-boundary")
       .data(data.features)
       .enter().append("path")
       .attr("class", "city-boundary")
       .attr("d", path)
       .style("fill", function(d) {
           var winningParty = getWinningParty(d.properties);
           return partyColors[winningParty];
       });

    // Add city names
    svg.selectAll(".city-name")
       .data(data.features)
       .enter().append("text")
       .attr("class", "city-name")
       .attr("x", function(d) {
            var centroid = path.centroid(d);
            return centroid[0];
        })
       .attr("y", function(d) {
            var centroid = path.centroid(d);
            return centroid[1];
        })
       .text(function(d) { return d.properties.name; })
       .attr("text-anchor", "middle")
       .attr("font-size", "10px")
       .attr("fill", "white");

}).catch(function(error) {
    console.log("Error loading GeoJSON data:", error);
});
