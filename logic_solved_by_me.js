// The purpose of this code is to visualize an earthquake data set.

// Give a name to the URL where the earthquake and tectonic plates information data from the United States Geological Survey (USGS).

var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";
var plateURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Load the earthquake data using JSON.
// With this function, we get the data we need and we import them into our script.

d3.json(quakeURL, function(data) {createFeatures(data.features);});

function createFeatures(quakeData) {var quakes = L.geoJSON(quakeData, {onEachFeature: function(feature, layer) 
    {layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");},
    pointToLayer: function (feature, latlng) {return new L.circle(latlng,{radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),fillOpacity: .6,color: "#000",stroke: true,weight: .8})}});
  createMap(quakes);}

// The function createMap creates the layers on the map.

function createMap(quakes) {

    // The layers created are: satellite street (map default), dark map (e.g., at night), gray scale (e.g., in black and white).
    
    var streetAPI = L.tileLayer("https://api.mapbox.com/styles/v1/abdullah1982/cjfkmkifh61fv2spbe9vt63b5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWJkdWxsYWgxOTgyIiwiYSI6ImNqZXZvcW02bDBsOXIzNW43NjF4Y3U3N3AifQ.ERPS9G84Dkk0buz91kG3FA");
    var mapAPI = L.tileLayer("https://api.mapbox.com/styles/v1/abdullah1982/cjfkmpd9s04ck2rn4qtpb0cah/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWJkdWxsYWgxOTgyIiwiYSI6ImNqZXZvcW02bDBsOXIzNW43NjF4Y3U3N3AifQ.ERPS9G84Dkk0buz91kG3FA");
    var scaleAPI = L.tileLayer("https://api.mapbox.com/styles/v1/abdullah1982/cjfla3gwz05m52so2en7hf6al/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWJkdWxsYWgxOTgyIiwiYSI6ImNqZXZvcW02bDBsOXIzNW43NjF4Y3U3N3AifQ.ERPS9G84Dkk0buz91kG3FA");
  
    // Set variables that define the base maps layers and that pass in to the other layers. 
    // So, the first layer is called "Satellite Street", etc.

    var backMap = {"Satellite Street": streetAPI,"Dark Map": mapAPI,"Gray Scale": scaleAPI};
    var plates = new L.LayerGroup();
    var topMap = {"Earthquakes": quakes,"Tectonic Plates": plates};

    // Set variables for the map center and the zoom.
    // Here's where we create the map with the center and the zoom.

    var matteoMap = L.map("map",{center:[21.3891, 39.8579],zoom: 2.25,layers: [streetAPI,quakes,]}); 
    d3.json(plateURL, function(plateData) {L.geoJson(plateData, {color: "yellow",weight: 2}).addTo(plate);});
    L.control.layers(backMap, {collapsed: falseba}).addTo(matteoMap);

    // Set variables for the legend.

    var legend = L.control({position: 'bottomright'});

        legend.onAdd = function(matteoMap){var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],labels = [];

    // Loop on density.  Depending on the intensity of the earthquake, we change the color of the circles.
    // This loops into the data to get the density of the earthquake, by using the getColor function, which assigns colors
    // depending on earthquake intensity.  
  
    for (var i = 0; i < grades.length; i++) {div.innerHTML +='<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');}
    return div;};

    legend.addTo(matteoMap);}
 
  // Set colors.  Define the function getColor so that if the intensity is higher than 5, the color is going to be dark red, etc.

  function getColor(d){return d > 5 ? "darkred":
    d  > 4 ? "darkorange":
    d > 3 ? "orange":
    d > 2 ? "yellow":
    d > 1 ? "yellowgreen":
             "green";}

  // Set a 45,000 maginutde factor for circles.
  // To make the circle available on the map.

  function getRadius(value){return value*45000}