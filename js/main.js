var userLat = 0;
var userLng = 0;
var map;
var sideMap;
var infowindow;
var markerImage;
var temp;
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
	}

	firebase.initializeApp(config);
	var database=firebase.database();
/////////////////////////////////////////////////////////////////////////////


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
			alert("Your Request for Help is being Sent!");	
        		var timerval= new Date(new Date().getTime()).toLocaleTimeString(); // 11:18:48 AM

        		var testJson = {
        			Sender:$('#help_Name').val(),
        			Timestamp: timerval,
        			Type:$('#help_Emergency').val(),
        			beingRescued:'false',
        			Contact:$('#help_contact').val(),
        			LocationLong: userLat,
        			LocationLat: userLng
        		};
    		
            firebase.database().ref().push(testJson, function(e)
            {   
            	console.log(e);
            });

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
	var sideMapCanvas = document.getElementById('sideMap');
	var heatMapData = [
		new google.maps.LatLng(32.732551, -97.1145368),
		new google.maps.LatLng(32.732745, -97.1144586),
		new google.maps.LatLng(32.732842, -97.1143688),
		new google.maps.LatLng(32.732919, -97.1142815),
		new google.maps.LatLng(32.732992, -97.1142112),
		new google.maps.LatLng(32.733100, -97.1141461),
		new google.maps.LatLng(32.733206, -97.1140829),
		new google.maps.LatLng(32.733273, -97.1140324),
		new google.maps.LatLng(32.733316, -97.1140023),
		new google.maps.LatLng(32.733357, -97.1139794),
		new google.maps.LatLng(32.733371, -97.1139687),
		new google.maps.LatLng(32.733368, -97.1139666),
		new google.maps.LatLng(32.733383, -97.1139594),
		new google.maps.LatLng(32.733508, -97.1139525),
		new google.maps.LatLng(32.733842, -97.1139591),
		new google.maps.LatLng(32.734147, -97.1139668),
		new google.maps.LatLng(32.734206, -97.1139686),
		new google.maps.LatLng(32.734386, -97.1139790),
		new google.maps.LatLng(32.734701, -97.1139902),
		new google.maps.LatLng(32.734965, -97.1139938)
	];
	var heatMapArray = new google.maps.MVCArray(heatMapData);	
	
	var mapOptions = {
		center: {lat: 32.73, lng: -97.11},
		zoom: 4,
		panControl: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var style=[{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#0066ff"},{"saturation":74},{"lightness":100}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"},{"weight":0.6},{"saturation":-85},{"lightness":61}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#5f94ff"},{"lightness":26},{"gamma":5.86}]}];

	map = new google.maps.Map(mapCanvas, mapOptions);
	sideMap = new google.maps.Map(sideMapCanvas, mapOptions);
	
	map.set('styles',style);
	sideMap.set('styles',style);
	
	markerImage = 'heart-icon2.png' ;

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
            
            map.setCenter(pos);
            sideMap.setCenter(pos);
            // map2.setCenter(pos);

        }, function() {
            handleLocationError(true, infowindow, map.getCenter());
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
		data: heatMapArray,
		map: sideMap
	});

	function getPoints() {
		//Generate points from DB
		var heatPoints= firebase.database().ref();
		heatPoints.on('value', function(snapshot){
			var array=snapshotToArray(snapshot);
			array.forEach(function(entry) {
				console.log(entry);
				heatMapArray.push(new google.maps.LatLng(entry.LocationLat, entry.LocationLong));
			});
		});
		return heatMapData;
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
	//Generate points from DB
	var testRead= firebase.database().ref();
	testRead.on('value', function(snapshot){
		var arr=snapshotToArray(snapshot);
		arr.forEach(function(entry) {
			//console.log(entry);

			if (entry.beingRescued=='false')
			{
				var marker = new google.maps.Marker({
				position: {lat: entry.LocationLong, lng: entry.LocationLat},
				map: map,
				icon: markerImage,
				data:entry
				});
			}

			else 
			var marker = new google.maps.Marker({
				position: {lat: entry.LocationLong, lng: entry.LocationLat},
				map: map,
				icon: "rescuer-icon.png",
				data:entry
				}
				);

			marker.addListener('click', function () {
				infowindow.open(map, marker);
				temp=entry;
				infowindow.setContent('<div class="info-window">' +
					'<h3>Emergency Information</h3>' +
					'<div class="info-content">' +
					'<p> Name: ' +entry.Sender+' </p>'+
					'<p>Emergency: '+entry.Type+'</p>'+
					'<p>Time Posted: '+entry.Timestamp+'</p>'+
					//'<p>Being Rescued?: '+entry.beingRescued+'</p>'+
					'<button type="button" class="btn btn-success btn-lg" ID="btn_Helping" onclick="btn_Helping()">Help This Person</button>' +
					'</div>' +
					'</div>');
			});
		});
	});
};


$('#btn_Helpingn').on('click', function(e)
{
	alert("You are committing to rescue this person, continue?");
});
function btn_Helping()
{
	var tempObj;
	alert(temp.Sender);
	
	  firebase.database().ref(temp.key).set({
	  				Sender:temp.Sender,
        			Timestamp: temp.Timestamp,
        			Type:temp.Type,
        			beingRescued:'true',
        			LocationLong: temp.LocationLong,
        			LocationLat: temp.LocationLat

	  });
	  reloadPins();

}
