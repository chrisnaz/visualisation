// TODO An API access token is required to use the API. Replace with your own (see how to get an API token in the slides). You can request your own on the Mapbox website

mapboxgl.accessToken = "pk.eyJ1IjoiYWNsYXJpbnZhbCIsImEiOiJjam1wY25sNGsxOXZqM2twa2hyaG0wbDF6In0.40Fo_wy_iUZGNL5j_CIXdA";

// A new map is created

var map = new mapboxgl.Map({
        container: "map",   // ID of the element that contains the map
        style: "mapbox://styles/mapbox/dark-v9",   // Type of map (other styles include light-v9, streets-v9, dark-v9, satellite-v9 and bright-v9, try them out to see which one is best for your map)
        center: [-110, 50],   // Coordinates of the center of the map [longitude, latitude]
        zoom: 2   // Initial zoom level (1 is the furthest zoom, it shows the whole world)
});

// Add zoom and rotation controls to the map

map.addControl(new mapboxgl.NavigationControl());

// container is the overlay of the map. The overlay will contain everything we add to the map

var container = map.getCanvasContainer();

// An svg is appended to the container. It will contain the visual elements

var svg = d3.select(container)
.append("svg")
    .attr("id", "polygons_container");   // The id of the svg is polygons_container

d3.json("./datasets/ufo_all_freq_by_us_state.json", function(data){   // The code in the function is executed only when the data is loaded. All code requiring that the data is fully loaded shoud come here

console.log(data);   // Always check if the data was correctly loaded!

// From this point, the code is different from the Mapbox only example

// The polygons contained in data.features are drawn

drawPolygons(data.features);

// A function drawing the polygons was defined. It can be called again if a different dataset needs to be drawn

function drawPolygons(polygons){

    // Remove the visual elements previously displayed on the map using brute force

    document.getElementById("polygons_container").innerHTML = "";

    // zones is the selection holding the polygons

    var zones = svg.selectAll("path")
        .data(polygons);

    // For each polygon, a path is appended

    zones.enter().append("path")
        .attr("class", "prefecture")   // The appended path have the class prefecture
        .on("mouseover", function(d) {
            d3.select(this).attr("class", "selected_prefecture");
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("class", "prefecture");
        })
        .append("title")   // A title is added to the path (when the mouse goes over a path, some text will show)
            .text(function(d){   // Text of the mouseover title
                return d.properties.name + " : " + d.properties.frequency + " alien ships were spotted !";   // The text displayed for a path is the name of the prefecture it represents
            });
        
    // This function renders the polygons on the map. Basically, it handles the projection of every polygon

    function render(){

        // Remember that zones is a selection of polygons. The .attr("d") is executed once for each path in zones

        zones
            .attr("d", path)
            
    }

    // render() is called when the event viewreset of the map is triggered
    // viewreset means that the content of the layer needs to be redrawn (e.g. zoom)

    map.on("viewreset", render);

    // render() is also called when the map is moved (navigation without zoom)

    map.on("move", render);

    // render() is called once for initial placement of the polygons

    map.on("load", render);
}

// d3.geo.path generates a path from geoJSON data
// path.projection(proj) specifies that the path will be generated following the projection proj
// The projection proj is d3.geo.transform({point: projectPoint}), that is a stream transform that receives points projected with the projectPoint function defined below
// Basically, this line defines a path generator that generates a path from points that are projected (from geographic coordinates into pixels) beforehand

var path = d3.geo.path().projection(d3.geo.transform({point: projectPoint}));

// This function defines the projection of the point (lon, lat) into pixels
// This function streams the projection result (x, y) to the stream transform d3.geo.transform

function projectPoint(lon, lat) {
    var point = map.project(new mapboxgl.LngLat(lon, lat));
    this.stream.point(point.x, point.y);
}

// More info on path generation based on projected points on
// https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Paths.md, and
// https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Streams.md

});