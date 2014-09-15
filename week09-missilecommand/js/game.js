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
	var city = new City(100, 500);
	this.cities.push(city);

	var missile = new Missile(10, 0, 50, 550);
	this.enemyMissiles.push(missile);

	var defenseMissile = new Missile(30, 500, 80, 0);
	defenseMissile.x = 80;
	defenseMissile.y = 300;
	this.defenseMissiles.push(defenseMissile);

	var bunker = new Bunker(10, 500);
	this.bunkers.push(bunker);

	var unexplainedExplosion = new Explosion(80, 80);
	// unexplainedExplosion.size = 50;
	this.explosions.push(unexplainedExplosion);

	this.render();
	this.requestAnimationFrame();
}

Game.prototype.step = function (elapsed) {
	this.updatePositions(elapsed);
	this.render();
}

Game.prototype.render = function () {
	this.renderer.render();
}

Game.prototype.updatePositions = function(elapsed) {
	var updateables = this.enemyMissiles.concat(this.defenseMissiles).concat(this.explosions);

	updateables.forEach(function(u) { u.updatePosition(elapsed); } );
}

Game.prototype.requestAnimationFrame = function() {
	var self = this;
	var lastTimestamp = 0;

	var handleAnimationFrame = function(t) {
		var diff = t - lastTimestamp;
		lastTimestamp = t;
		self.step.call(self, diff);
		window.requestAnimationFrame(handleAnimationFrame);
	};

	window.requestAnimationFrame(handleAnimationFrame);
}

var game = new Game();
game.initialize();
