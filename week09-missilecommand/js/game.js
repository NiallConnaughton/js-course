var $canvas = $('#canvas');
var ctx = canvas.getContext('2d'); 

function Game() {
	this.renderer = new Renderer(this);
	this.cities = [];
	this.bunkers = [];
	this.enemyMissiles = [];
	this.defenseMissiles = [];
	this.explosions = [];
}

Game.prototype.initialize = function() {
	var city = new City(20, 450);
	this.cities.push(city);

	var missile = new Missile(10, 0, 50, 550);
	this.enemyMissiles.push(missile);

	var defenseMissile = new Missile(30, 500, 80, 0);
	this.defenseMissiles.push(defenseMissile);

	var bunker = new Bunker(10, 500);
	this.bunkers.push(bunker);

	var unexplainedExplosion = new Explosion(80, 80);
	this.explosions.push(unexplainedExplosion);

	this.render();
}

Game.prototype.render = function (timestamp) {
	console.log('rendering' + this);
	this.renderer.render();
}

Game.prototype.requestAnimationFrame = function() {
	var self = this;
	window.requestAnimationFrame(function(t) {
		self.render.call(self, t);
	});
}

var game = new Game();
game.initialize();
