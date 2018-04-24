
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// quering urls
d3.json(earthquakeURL, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },
    
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: .6,
        color: "#000",
        stroke: true,
        weight: .8
    })
  }
  });

  createMap(earthquakes);
}


function createMap(earthquakes) {

    // defining maps layers
    
    var satelliteStreet = L.tileLayer("https://api.mapbox.com/styles/v1/abdullah1982/cjfkmkifh61fv2spbe9vt63b5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWJkdWxsYWgxOTgyIiwiYSI6ImNqZXZvcW02bDBsOXIzNW43NjF4Y3U3N3AifQ.ERPS9G84Dkk0buz91kG3FA");

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/abdullah1982/cjfkmpd9s04ck2rn4qtpb0cah/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWJkdWxsYWgxOTgyIiwiYSI6ImNqZXZvcW02bDBsOXIzNW43NjF4Y3U3N3AifQ.ERPS9G84Dkk0buz91kG3FA");

    var gray = L.tileLayer("https://api.mapbox.com/styles/v1/abdullah1982/cjfla3gwz05m52so2en7hf6al/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWJkdWxsYWgxOTgyIiwiYSI6ImNqZXZvcW02bDBsOXIzNW43NjF4Y3U3N3AifQ.ERPS9G84Dkk0buz91kG3FA");
  
    // defining the base maps layers and pass in other layers 
    var baseMaps = {
      "Satellite Street": satelliteStreet,
      "Dark Map": darkmap,
      "Gray Scale": gray
    };


    var tectonicPlates = new L.LayerGroup();

    var overlayMaps = {
      "Earthquakes": earthquakes,
      "Tectonic Plates": tectonicPlates
    };

    // setting the center of the map and zoom
    var myMap = L.map("map", {
      center: [
        21.3891, 39.8579],
      zoom: 2.25,
      layers: [satelliteStreet, earthquakes,]
    }); 

    d3.json(tectonicPlatesURL, function(plateData) {
      L.geoJson(plateData, {
        color: "yellow",
        weight: 2
      })
      .addTo(tectonicPlates);
  });

  

    L.control.layers(baseMaps, {
      collapsed: false
    }).addTo(myMap);


  var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(myMap){
      var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

  // looping density
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}
 
 
  function getColor(d){
    return d > 5 ? "darkred":
    d  > 4 ? "darkorange":
    d > 3 ? "orange":
    d > 2 ? "yellow":
    d > 1 ? "yellowgreen":
             "green";
  }

  // maginutde factor of 45,000 for circles. 
  function getRadius(value){
    return value*45000
  }
