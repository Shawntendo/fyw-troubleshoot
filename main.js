//Use .env file in config folder
//require("dotenv").config({ path: "./config/.env" });

let map, geocoder, addressArr = []
let position = [40.65489, -75.11352]
let currentMarker
let codedArr = [ {lat:40.6566104, lng:-75.11770899999999},
                  {lat:40.6566319, lng:-75.1187581}]
let infoArr = ['info string 1', 'info string 2']
let typeArr = [0,3]
const iconImage = [ './icons/flask-solid.svg',
                    './icons/snowflake-solid.svg',
                    './icons/snowplow-solid.svg',
                    './icons/tree-solid.svg',
                    './icons/truck-solid.svg',
                    './icons/umbrella-solid.svg']

// addressArr = ['116 Birch Lane, Bloomsbury, NJ',
//               '118 Birch Lane, Bloomsbury, NJ'];

function initMap(){
  console.log('init')
  console.log(addressArr)

  //sets options
  var options = {
    zoom: 15,
    center:{lat:40.65489, lng:-75.11352}
  }
  //initializes map with options
  map = new google.maps.Map(document.getElementById('map'), options)
  //geocoder makes markers for all addresses in array
  geocoder = new google.maps.Geocoder();
  for(let i=0; i<addressArr.length; i++){
    codeAddress(geocoder, map, addressArr[i]);
  }
  
  for(let i=0; i<codedArr.length; i++){
    let tempMarker = new google.maps.Marker({
      position:codedArr[i],
      map:map,
      icon: iconImage[typeArr[i]]})
    let tempWindow = new google.maps.InfoWindow({
      content:`<span class="infoWindow windowTop">info window ${i+1}?<br></span>
               <span class="infoWindow windowBot">${infoArr[i]}</span>`})
    tempMarker.addListener('click',function(){
      tempWindow.open(map,tempMarker);
      console.log('window opened')})
  }

  currentMarker = new google.maps.Marker({
    position:{lat:40.65489, lng:-75.11352},
    map:map,
    // icon:google.maps.SymbolPath.BACKWARD_CLOSED_ARROW
  })

  var infoWindow = new google.maps.InfoWindow({
    content:'<h1>info window?</h1>'
  })
  currentMarker.addListener('click',function(){
    infoWindow.open(map,currentMarker)
  })

  // const bodyListen = document.querySelector('body')
  // bodyListen.addEventListener('click', (event) => {
  //   console.log(event)
  //   if(event.target.tagName === 'A'){
  //     console.log(event.target.tagName)
  //     console.log(event.target.innerText)
  //   }
  //   else{
  //     console.log('bodyListen fired, tag did not')
  //     console.log(event.target.tagName)
  //     console.log(event.target.innerText)
  //   }
  // })

  //5-16 temp
  google.maps.event.addListener(map, 'click', function(event) {
    var result = [event.latLng.lat(), event.latLng.lng()];
    console.log('listener ' + result)
    transition(result);
  });

  console.log('map should be here')
  console.log(codedArr)
}

//5-16 temp
var numDeltas = 100;
var delay = 10; //milliseconds
var i = 0;
var deltaLat;
var deltaLng;
function transition(result){
    i = 0;
    deltaLat = (result[0] - position[0])/numDeltas;
    deltaLng = (result[1] - position[1])/numDeltas;
    moveMarker();
}
function moveMarker(){
    position[0] += deltaLat;
    position[1] += deltaLng;
    var latlng = new google.maps.LatLng(position[0], position[1]);
    currentMarker.setTitle("Latitude:"+position[0]+" | Longitude:"+position[1]);
    currentMarker.setPosition(latlng);
    if(i!=numDeltas){
        i++;
        setTimeout(moveMarker, delay);
    }
}

function codeAddress(geocoder, map, address) {
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location);
      var addrMarker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      console.log(results[0].geometry.location.lat())
      console.log(results[0].geometry.location.lng())
      console.log(addrMarker.position.toString())
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}