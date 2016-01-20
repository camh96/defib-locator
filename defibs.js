google.maps.event.addDomListener(window, 'load', initialise);

var map;
var DefibMarkers = [];

function initialise() {
    var mapOptions = {
        zoom: 15,
        center: { lat: -41.29360790079944, lng: 174.7777470946312}
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            console.log(pos.coords);
            var myLocationAccuracy = new google.maps.Circle({
                'map': map,
                'center': new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                'radius': pos.coords.accuracy,
                'fillColor': '#E95C42',
                'fillOpacity': 0.7,
                'strokeColor': '#FFFFFF', 
                'strokeOpacity': 0.7,
                'strokeWeight': 1
            })
            var myLocation = new google.maps.Marker({
                'map': map,
                'position': new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
            });
        });
    }

    loadDefibs();
}

function loadDefibs() {
    var request = new XMLHttpRequest();
    request.open('GET', 'defibs.json', true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            processDefibs(data);
        } else {
            // We reached our target server, but it returned an error

        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
    };

    request.send();
}

function processDefibs(defibs) {
    console.log(defibs);

    defibs.sort(function (defibA, DefibB) {
    	return DefibB.lat - defibA.lat;
    });

    for (var i = 0; i < defibs.length; i++) {
    	addDefibMarkers(defibs[i]);
    };

    var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < DefibMarkers.length; i++) {
    	bounds.extend(DefibMarkers[i].getPosition());
    };
    map.fitBounds(bounds);
}

function addDefibMarkers(defib) {
    var marker = new google.maps.Marker({
        'map': map,
        'position': new google.maps.LatLng(defib.lat, defib.lng),
        'title': defib.name,
        'icon': 'img/wfa.jpg'

    });

    DefibMarkers.push(marker);

    var defibList = document.querySelector("#defib-list");

    var listItem = document.createElement('li');
    listItem.innerHTML = "<a href='#'>" + defib.name+ "</a>";

    defibList.appendChild(listItem);

    listItem.addEventListener('click', function(evt) { 
        evt.preventDefault();
        selectMarker(marker, listItem);
    });

    google.maps.event.addDomListener(marker, 'click', function() {
        selectMarker(marker, listItem);
    });

    google.maps.event.addDomListener(marker, 'click', function() {
        selectMarker(marker, listItem);

        var contentString = document.querySelector("#infowindow-content").innerHTML;
        contentString = contentString.replace(/\{\{imgurl\}\}/g, defib.image);
        contentString = contentString.replace(/\{\{name\}\}/g, defib.name);
        contentString = contentString.replace(/\{\{content\}\}/g, defib.content);
        contentString = contentString.replace(/\{\{icons\}\}/g, defib.icons);
        console.log(contentString);
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    });
    
}

function selectMarker(marker, listItem) {
    deselectAllMarkers();
    listItem.className = "active";
    marker.setIcon('img/wfa.jpg');
    marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
    map.setZoom(16);
    map.panTo(marker.getPosition());
}

function deselectAllMarkers() {
    for (var i = 0; i < DefibMarkers.length; i += 1) {
        DefibMarkers[i].setIcon('img/wfa.jpg');
        DefibMarkers[i].setZIndex(null);
    }
    var listItems = document.querySelectorAll("#defib-list li");
    for (var i = 0; i < listItems.length; i += 1) {
        listItems[i].className = "";
    }
}

var infowindow = new google.maps.InfoWindow({});









