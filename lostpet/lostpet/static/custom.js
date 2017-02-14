function initMap() {

  // Specify where the map is centered
  // Defining this variable outside of the map optios markers
  // it easier to dynamically change if you need to recenter
  var mysanFrancisco = {lat: 37.773, lng: -122.431};

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map-container'), {
    center: mysanFrancisco,
    zoom: 9
  });

  var infoWindow = new google.maps.InfoWindow({
    width: 150});


  // Retrieving the information with AJAX
$.get('/lostpets/api/lostpets.json', function (response) {
      // Attach markers to each lostpet location in returned JSON
      // [
      //     {
      // "lostpet_id": 1,
      // "lostpet_name": None,
      // "species_code": "c",
      // "title": "Lost cat (male orange tabby)",
      // "description": "My cat Milo has been missing since October. We live near San Rafael highschool. If anyone has seen him or knows where he is please let me know.",
      // "datetime": "2017-02-08 17:53:37.080000",
      // "photo": "https://images.craigslist.org/00P0P_jt3Lu2CTXB8_600x450.jpg",
      // "latitude": 37.968884,
      // "longitude": -122.511903,
      // "neighborhood": " (san rafael)",
      // "url": "https://sfbay.craigslist.org/nby/laf/5995666386.html",
      // }
      // ]

    var lostpet, marker, html;

    for (var i = 0; i < response.result.length; i++) {
        lostpet = response.result[i];
        console.log(lostpet);

        // Define the marker
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lostpet.latitude, lostpet.longitude),
            map: map,
            title: 'Title: ' + lostpet.title
        });

        html = (
            '<div class="window-content">' +
                '<p><b>Pet Title: </b>' + lostpet.title + '</p>' +
                '<p><b>Description: </b>' + lostpet.description + '</p>' +
                '<p><b>Location: </b>' + lostpet.neighborhood + '</p>' +
            '</div>');

        bindInfoWindow(marker, map, infoWindow, html);

    }

});
    
function bindInfoWindow(marker, map, infoWindow, html) {
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.close();
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
  }

}
// debugger;
// google.maps.event.addDomListener(window, 'load', initMap);
// debugger;
