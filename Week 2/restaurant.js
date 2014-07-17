$('div#content').append([
	'<ul id="tabmenu">',
		'<li onclick="makeactive(1)"><a class="" id="tab1">Home</a></li>',
		'<li onclick="makeactive(2)"><a class="" id="tab2">Menu</a></li>',
		'<li onclick="makeactive(3)"><a class="" id="tab3">Location</a></li>',
	'</ul>',
	'<div id="tabContent"></div>'].join('\n'));

var homeContent = [
		'<div id="homeContent">',
		'<img id ="burgerImg" src="http://www.cherwell.org/library/image/byron-burger_4358.jpg"/>',
		'<h1>+</h1>',
		'<img id ="lobsterImg" src="http://bennydoro.com/chef/files/2011/07/IMG_9655-1024x683-584x389.jpg"/>',
		'<h1>=</h1>',
		'<img id ="burgerLobsterImg" src="http://www.rocketandsquash.com/wp-content/uploads/2012/01/Burger-and-Lobster1.jpg"/>',
		'</div>'].join('\n');

var menuContent = [
		'<p>Menu</p>',
		'<p>Burger - &pound;20</p>',
		'<p>Lobster - &pound;20</p>'
		];

var locationContent = [
'<div id="map-canvas"></div>'
];

function makeactive(tab) {
	$('tab1').className = '';
	$('tab2').className = '';
	$('tab3').className = '';

	var selectedTab = 'tab' + tab;
	$(selectedTab).className = 'active';

	$('div#tabContent').empty();
	if (tab === 1)
		$('div#tabContent').append(homeContent);
	else if (tab === 2)
		$('div#tabContent').append(menuContent);
	else if (tab === 3)
	{
		$('div#tabContent').append(locationContent);
		initializeMap();
	}
}

var map;
var geocoder;
function initializeMap() {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(51.512, -0.127)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  geocoder = new google.maps.Geocoder();

  addMarker('W1J 7EF', 'Burger & Lobster Mayfair');
  addMarker('W1D 4PS', 'Burger & Lobster Soho');
  addMarker('EC1M 4AY', 'Burger & Lobster Farringdon');
  addMarker('EC4M 9BE', 'Burger & Lobster City');
  addMarker('SW1X 7RJ', 'Burger & Lobster Knightsbridge');
  addMarker('W1W 7JE', 'Burger & Lobster Fitzrovia');
}

function addMarker(postcode, label) {
	geocoder.geocode( { 'address': postcode },
		function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
		      var marker = new google.maps.Marker({
		          map: map,
		          position: results[0].geometry.location,
		          title: label
		      });
			}
		});
}

makeactive(1);
// google.maps.event.addDomListener(window, 'load', initialize);