var userLat = 0;
var userLng = 0;
var map;
var sideMap;
var infowindow;
var markerImage = 'sos-icon.png';
var	markerImage2= 'rescuer-icon.png';
	
var temp;
var markers=[];


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
	}

	firebase.initializeApp(config);

$('#submit_Help').on('click', function(e){

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			pos.lat+= getRandom(0.0001,-0.0001);
			pos.lng+= getRandom(0.0001,-0.0001);

			userLat = pos.lat;
			userLng = pos.lng;
			alert("Sending Request");	
        		//var timerval= new Date(new Date().getTime()).toLocaleTimeString(); // 11:18:48 AM
        		var timerval="a";
        		var testJson = {
        			Sender:$('#help_Name').val(),
        			Timestamp: timerval,
        			Type:$('#help_Emergency').val(),
        			beingRescued:false,
        			contact:$('#help_contact').val(),
        			LocationLong: userLat,
        			LocationLat: userLng
        		};
    		//infowindow.setPosition(pos);
            //infowindow.setContent('Location found.');
            //infowindow.open(map); 
            //map.setCenter(pos);

            //Post data
            firebase.database().ref().push(testJson, function(e)
            {   
            	console.log(e);
            });

            reloadPins();
        }, function() {
        	//handleLocationError(true, infoWindow, map.getCenter());
        });
	} 
	else {
        // Browser doesn't support Geolocation
        //handleLocationError(false, infoWindow, map.getCenter());
    }

});
var database = firebase.database().ref();
database.on('value', function()
{
	reloadPins();
});


});

function initMap() {

	var mapCanvas = document.getElementById('map');
	var sideMapCanvas = document.getElementById('sideMap'); 

	var heatMapData = [
		new google.maps.LatLng(32.732551, -97.1145368),
		new google.maps.LatLng(32.732745, -97.1144586)
	];
	var heatMapArray = new google.maps.MVCArray(heatMapData);	
	
	var mapOptions = {
		center: {lat: 32.73, lng: -97.11},
		zoom: 16,
		panControl: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var style=[{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#0066ff"},{"saturation":74},{"lightness":100}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"},{"weight":0.6},{"saturation":-85},{"lightness":61}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#5f94ff"},{"lightness":26},{"gamma":5.86}]}];

	map = new google.maps.Map(mapCanvas, mapOptions);
	sideMap = new google.maps.Map(sideMapCanvas, mapOptions);
	
	var heatMapData = [
		new google.maps.LatLng(32.732551, -97.1145368),
		new google.maps.LatLng(32.732745, -97.1144586),
		new google.maps.LatLng(32.732842, -97.1143688)
	];
	var heatMapArray = new google.maps.MVCArray(heatMapData);

	map.set('styles',style);
	sideMap.set('styles',style);
	

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
            sideMap.setCenter(pos);
            // map2.setCenter(pos);

        }, function() {
        	//handleLocationError(true, infowindow, map.getCenter());
        });
	} 
	else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }


    infowindow = new google.maps.InfoWindow({
    	maxWidth: 400
    });

	heatmap = new google.maps.visualization.HeatmapLayer({
		data: getPoints(),
		map: sideMap,
		radius: 20,
		opacity: 1
	});

	function getPoints() {
		//Generate points from DB
		var heatPoints= firebase.database().ref();
		heatPoints.on('value', function(snapshot){
			var array=snapshotToArray(snapshot);
			array.forEach(function(entry) {
				console.log(entry);
				heatMapArray.push(new google.maps.LatLng(entry.LocationLong, entry.LocationLat));
			});
		});
		return heatMapArray;
	}

	function getPoints() {
		//Generate points from DB
		var heatPoints= firebase.database().ref();
		heatPoints.on('value', function(snapshot){
			var array=snapshotToArray(snapshot);
			array.forEach(function(entry) {
				console.log(entry);
				heatMapArray.push(new google.maps.LatLng(entry.LocationLong, entry.LocationLat));
			});
		});
		return heatMapArray;
	}

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
	clearOverlays();
	var tmp;
	//Generate points from DB
	var testRead= firebase.database().ref();
	testRead.on('value', function(snapshot){
		var arr=snapshotToArray(snapshot);
		arr.forEach(function(entry) {
			//console.log(entry);
			if(entry.beingRescued==true)
			{
				tmp=markerImage2;
			}
			else{
				tmp=markerImage;
			}
			var marker = new google.maps.Marker({
				position: {lat: entry.LocationLong, lng: entry.LocationLat},
				map: map,
				
				icon: "rescuer-icon.png",

				icon: tmp,
				
				icon: "rescuer-icon.png",
				icon: tmp,
				data:entry
			});
			marker.addListener('click', function () {
				infowindow.open(map, marker);
				temp=entry;
				infowindow.setContent('<div class="info-window">' +
					'<h3>Emergency Information</h3>' +
					'<div class="info-content">' +
					'<p> Name: ' +entry.Sender+' </p>'+
					'<p>Emergency: '+entry.Type+'</p>'+
					'<p>Time Posted: '+entry.Timestamp+'</p>'+
					'<p>Contact Info: '+entry.contact+'</p>'+
					'<p>Being Rescued?: '+entry.beingRescued+'</p>'+
					'<button type="button" class="btn btn-success btn-lg" ID="btn_Helping" onclick="btn_Helping()">Help This Person</button>' +
					'</div>' +
					'</div>');
			});
			markers.push(marker);
		});
	});
}; 


function btn_Helping()
{
	var tempObj;

	firebase.database().ref(temp.key).set({
		Sender:temp.Sender,
		Timestamp: temp.Timestamp,
		Type:temp.Type,
		beingRescued:true,
		contact:temp.contact,
		LocationLong: temp.LocationLong,
		LocationLat: temp.LocationLat

	});
}


function clearOverlays() {
	for (var i = 0; i < markers.length; i++ ) {
		markers[i].setMap(null);
	}
	markers.length = 0;
}



