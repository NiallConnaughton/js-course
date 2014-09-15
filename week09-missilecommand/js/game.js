var $canvas = $('#canvas');
var ctx = canvas.getContext('2d'); 

function Game() {
	this.renderer = new Renderer(this);
	this.cities = [];
}

Game.prototype.initialize = function() {
	var city = new City(20, 650);
	this.cities.push(city);
}

Game.prototype.onRenderRequest = function (timestamp) {
	console.log('rendering' + this);
	this.renderer.render();
}


var game = new Game();
window.requestAnimationFrame(function(t) {
	game.onRenderRequest.call(game, t);
});