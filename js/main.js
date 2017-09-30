var userLat = 0;
var userLng = 0;

////////////////////////////////////////////////////////////////////DO NOT DELETE
$(function () {

   var config = {
     apiKey: "AIzaSyCbwJo5TPR5rNfps27T1p2i_s6rc_R_Wpc",
     authDomain: "hack-fbbed.firebaseapp.com",
     databaseURL: "https://hack-fbbed.firebaseio.com",
     projectId: "hack-fbbed",
     storageBucket: "",
     messagingSenderId: "451916850408"
    };
    
    firebase.initializeApp(config);
    var database=firebase.database();
/////////////////////////////////////////////////////////////////////////////

    $('#HelpMe').on('click', function(e){
        alert("POSTING!!!!!!!!!");

        var testJson = {
            Sender:"Test",
            Timestamp:"Test",
            LocationLong: userLat,
            LocationLat: userLng
        };
        //firebase.database().ref().child('Flood').push.key();
        var id="John"
        firebase.database().ref('Flood/' + id +'/').push(testJson, function(e)
            {   
                console.log(e);
            });
    });
    //google.maps.event.addDomListener(window, 'load', initMap);
});

function initMap() {

    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: {lat: -34.397, lng: 150.644},
        zoom: 16,
        panControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var style=[{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#0066ff"},{"saturation":74},{"lightness":100}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"},{"weight":0.6},{"saturation":-85},{"lightness":61}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#5f94ff"},{"lightness":26},{"gamma":5.86}]}];

    var map = new google.maps.Map(mapCanvas, mapOptions);
    map.set('styles',style);

    var markerImage = 'heart-icon.png';

    var contentString = '<div class="info-window">' +
    '<h3>Emergency Information</h3>' +
    '<div class="info-content">' +
    '<p> Name: Bob </p>'+
    '<p>Test: Test</p>'+
    '<button type="button" class="btn btn-success btn-lg" ID="btn_Helping">Help This Person</button>' +
    '</div>' +
    '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 400
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
            };
            userLat = pos.lat;
            userLng = pos.lng;
            infowindow.setPosition(pos);
            //infowindow.setContent('Location found.');
            //infowindow.open(map);
            map.setCenter(pos);

            var location = new google.maps.LatLng(userLat, userLng);
            
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                icon: markerImage
            });

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } 
    else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

}

