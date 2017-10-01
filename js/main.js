var userLat = 0;
var userLng = 0;
var map;
var infowindow;
var markerImage;
////////////////////////////////////////////////////////////////////DO NOT DELETE
$(function () {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
		});
	}

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

$('#submit_Help').on('click', function(e){
	//alert("POSTING!!!!!!!!!");


        //firebase.database().ref().child('Flood').push.key();


        if (navigator.geolocation) {
        	navigator.geolocation.getCurrentPosition(function(position) {
        		var pos = {
        			lat: position.coords.latitude,
        			lng: position.coords.longitude
        		};
        		pos.lat+= getRandom(0.0001,-0.0001);
        		userLat = pos.lat;
        		userLng = pos.lng;
        		alert(userLat);


        		var testJson = {
        			Sender:$('#help_Name').val(),
        			Timestamp:"Test",
        			Type:$('#help_Emergency').val(),
        			LocationLong: userLat,
        			LocationLat: userLng
        		};
    		//infowindow.setPosition(pos);
            //infowindow.setContent('Location found.');
            //infowindow.open(map); 
            //map.setCenter(pos);

            //Post data
            var id="John"
            firebase.database().ref('Flood/' + id).push(testJson, function(e)
            {   
            	console.log(e);
            });

            var location = new google.maps.LatLng(userLat, userLng);
            
            /*
            var marker = new google.maps.Marker({
            	position: location,
            	map: map,
            	icon: markerImage,
            	data: testJson
            });

            marker.addListener('click', function () {
            	infowindow.setContent(generateContent(data));
            	infowindow.open(map, marker);
            });
            */
            reloadPins();
        }, function() {
        	handleLocationError(true, infoWindow, map.getCenter());
        });
        } 
        else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

});

});

function initMap() {

	var mapCanvas = document.getElementById('map');
	var mapOptions = {
		center: {lat: 32.73, lng: -97.11},
		zoom: 16,
		panControl: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var style=[{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#0066ff"},{"saturation":74},{"lightness":100}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"},{"weight":0.6},{"saturation":-85},{"lightness":61}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#5f94ff"},{"lightness":26},{"gamma":5.86}]}];

	map = new google.maps.Map(mapCanvas, mapOptions);
	map.set('styles',style);

	markerImage = 'heart-icon.png';

	var contentString = '<div class="info-window">' +
	'<h3>Emergency Information</h3>' +
	'<div class="info-content">' +
	'<p> Name: Bob </p>'+
	'<p>Test: Test</p>'+
	'<button type="button" class="btn btn-success btn-lg" ID="btn_Helping">Help This Person</button>' +
	'</div>' +
	'</div>';

	
	infowindow = new google.maps.InfoWindow({
		maxWidth: 400
	});
	
	
	reloadPins()
}



function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

function snapshotToArray(snapshot) {
	var returnArr = [];

	snapshot.forEach(function(childSnapshot) {
		var item = childSnapshot.val();
		item.key = childSnapshot.key;

		returnArr.push(item);
	});

	return returnArr;
};


function reloadPins()
{
	//Generate points from DB
	var id="John"
	var testRead= firebase.database().ref('Flood/' + id +'');
	testRead.on('value', function(snapshot){
		var arr=snapshotToArray(snapshot);
		arr.forEach(function(entry) {
			console.log(entry);

			var marker = new google.maps.Marker({
				position: {lat: entry.LocationLong, lng: entry.LocationLat},
				map: map,
				icon: markerImage,
				data:entry
			});
			marker.addListener('click', function () {
				infowindow.open(map, marker);
				infowindow.setContent('<div class="info-window">' +
					'<h3>Emergency Information</h3>' +
					'<div class="info-content">' +
					'<p> Name: ' +entry.Sender+' </p>'+
					'<p>Emergency: '+entry.Type+'</p>'+
					'<p>Time Posted: '+entry.Timestamp+'</p>'+
					'<button type="button" class="btn btn-success btn-lg" ID="btn_Helping">Help This Person</button>' +
					'</div>' +
					'</div>');
			});
		});
	});
}


function generateContent(entry){
	return '<div class="info-window">' +
	'<h3>Emergency Information</h3>' +
	'<div class="info-content">' +
	'<p> Name: ' +data.Sender+' </p>'+
	'<p>Emergency: '+data.Type+'</p>'+
	'<p>Time Posted: '+data.Timestamp+'</p>'+
	'<button type="button" class="btn btn-success btn-lg" ID="btn_Helping">Help This Person</button>' +
	'</div>' +
	'</div>';
}