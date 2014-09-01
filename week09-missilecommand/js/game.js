var $canvas = $('#canvas');
var ctx = canvas.getContext('2d'); 

var img = new Image();
img.src = 'images/ground.png';
img.onload = function() {
	console.log('foo');

	var groundPattern = ctx.createPattern(img,'repeat-x');
	ctx.fillStyle = groundPattern;
	ctx.translate(0, 495);
	ctx.fillRect(0, 0, 800, 105);
}