// settings -------------------------------------------------------------------------------------

var map = L.map('map').setView([50.7318, 7.1009], 15);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'klang.ng9i3eh6',
    accessToken: 'pk.eyJ1Ijoia2xhbmciLCJhIjoiY2llc2d1ZzBjMDAwMDlqa3N5amM0emxmeCJ9.-IYjn89ohocerNpQDPbpMw'
}).addTo(map);

// Linked Geo Data global variables ------------------
default_lgd_graph_uri = "http://linkedgeodata.org/sparql?default-graph-uri=http%3A%2F%2Flinkedgeodata.org&query="
default_lgd_query = 
`PREFIX lgd: <http://linkedgeodata.org/ontology/>
 PREFIX geom: <http://geovocab.org/geometry#>
 PREFIX ogc: <http://www.opengis.net/ont/geosparql#>
 PREFIX owl: <http://www.w3.org/2002/07/owl#>

 SELECT ?barName, ?barGeo {
    ?bonn owl:sameAs <http://dbpedia.org/resource/Bonn> .
    ?bonn geom:geometry [ ogc:asWKT ?bonnGeo] .
    ?bar a lgd:Bar .
    ?bar rdfs:label ?barName .    
    ?bar geom:geometry [ ogc:asWKT ?barGeo] .

    FILTER(bif:st_intersects (?bonnGeo, ?barGeo, 5)) .

 } LIMIT 10`
lgd_result_format = "&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on"


function init() {
    lgd_query = document.getElementById("lgd_query")
    lgd_query.innerHTML = default_lgd_query
}



function executeLgdQuery() 
{
  lgd_query = document.getElementById("lgd_query")
  console.log(lgd_query)
  console.log(lgd_query.value)
  full_query = default_lgd_graph_uri + encodeURIComponent(lgd_query.value) + lgd_result_format 
  httpGetAsync(full_query, processData)
}


function processData(results)
{
    var jsonResult = JSON.parse(results, null, 2);
    
    instanceList = jsonResult.results.bindings

    console.log(instanceList)

    for (let instance of instanceList)
    {
      console.log(instance.barName.value)

      drawToMap(instance.barName.value, instance.barGeo.value)
    }

}



function drawToMap(instanceName, instanceGeo) {

  console.log(instanceGeo)

  lat = instanceGeo.substring(6, 14)
  long = instanceGeo.substring(16, 24)

  console.log(lat)
  console.log(long)




  // "POINT(7.1830067 50.8969143)"

  L.marker([long, lat], {icon:markerIcon}).addTo(map)
    .bindPopup(instanceName)
    .openPopup();

 
}



var markerIcon = L.icon({
    iconUrl: 'img/marker-icon.png',
    iconSize: [20, 20], 
});




// fillColor: '#003399',
function style(feature) {
    return {
        fillColor: '#003399',
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 1.0
    };
}


var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};




function onEachFeature(feature, layer) {
    //bind click
    layer.on({
        click: whenClicked
    });
}


function whenClicked(e) {
  // e = event
  console.log(e);
  console.log(e.target.feature.properties.ADMIN)
  // You can make your ajax call declaration here
  //$.ajax(... 
}





function httpGetAsync(requestUrl, processData)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() { 
        if (xhr.readyState == 4 && xhr.status == 200)
        {
            processData(xhr.responseText);
        }

    }

    xhr.open("GET", requestUrl, true); // true for asynchronous 
    xhr.send(null);
}



//http://linkedgeodata.org/sparql?default-graph-uri=http://linkedgeodata.org&query=PREFIX+lgdo:+<http://linkedgeodata.org/ontology/>PREFIX+geom:+<http://geovocab.org/geometry#>PREFIX+ogc:+<http://www.opengis.net/ont/geosparql#>PREFIX+owl:+<http://www.w3.org/2002/07/owl#>SELECT+*+{++?s+owl:sameAs+<http://dbpedia.org/resource/Bonn>+.++?s+geom:geometry+[+ogc:asWKT+?sg]+.++?x+a+<http://linkedgeodata.org/ontology/Bar>+.++?x+rdfs:label+?l+.++++++?x+geom:geometry+[+ogc:asWKT+?xg]+.++FILTER(bif:st_intersects+(?sg,+?xg,+20))+.}+LIMIT+3&format=application/sparql-results+json&timeout=0&debug=on
//&format=application/sparql-results+json&timeout=0&debug=on
//endPoint = "http://linkedgeodata.org/sparql?default-graph-uri=http%3A%2F%2Flinkedgeodata.org"
//endParameter = "&format=application/sparql-results+json&timeout=0&debug=on"; 

//fullRequest = endPoint + "&query=" + encodeURIComponent(sparqlString) + endParameter







// --------------------------------------------------------------------------------------------
var popup = L.popup();

function onMapClick(e) {
    popup
  .setLatLng(e.latlng)
  .setContent("You clicked the map at " + e.latlng.toString())
  .openOn(map);

    drawFields();
}

map.on('click', onMapClick);


