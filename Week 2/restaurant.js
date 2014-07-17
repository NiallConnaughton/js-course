$('div#content').append('<h1>Burger & Lobster</h1>');

$('div#content').append([
	'<ul id="tabmenu">',
		'<li onclick="makeactive(1)"><a class="" id="tab1">Home</a></li>',
		'<li onclick="makeactive(2)"><a class="" id="tab2">Menu</a></li>',
		'<li onclick="makeactive(3)"><a class="" id="tab3">Location</a></li>',
	'</ul>',
	'<div id="tabContent"></div>'].join('\n'));

var homeContent = [
		'<br/>',
		'<img src="http://www.cherwell.org/library/image/byron-burger_4358.jpg" style="max-width:300"/>',
		'<h1>+</h1>',
		'<img src="http://bennydoro.com/chef/files/2011/07/IMG_9655-1024x683-584x389.jpg" style="max-width:300"/>',
		'<h1>=</h1>',
		'<img src="http://www.rocketandsquash.com/wp-content/uploads/2012/01/Burger-and-Lobster1.jpg" style="max-width:300"/>'];

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
		initialize();
	}
}

var map;
function initialize() {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

// google.maps.event.addDomListener(window, 'load', initialize);