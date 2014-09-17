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

	// var missile = this.createMissile(10, 0, 50, 550);
	var missile = this.createMissile(10, 0, 50, 200);
	this.enemyMissiles.push(missile);

	var defenseMissile = this.createMissile(30, 500, 80, 0);
	this.defenseMissiles.push(defenseMissile);

	var bunker = new Bunker(10, 500);
	this.bunkers.push(bunker);

	var unexplainedExplosion = new Explosion(80, 80);
	this.explosions.push(unexplainedExplosion);

	this.render();
	this.requestAnimationFrame();
}

Game.prototype.createMissile = function(sourceX, sourceY, targetX, targetY) {
	var missile = new Missile(sourceX, sourceY, targetX, targetY);
	missile.onExploded = this.onMissileExploded.bind(this);

	return missile;
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

Game.prototype.onMissileExploded = function(missile) {
	this.defenseMissiles = this.defenseMissiles.filter(function (m) { return m != missile });
	this.enemyMissiles = this.enemyMissiles.filter(function (m) { return m != missile; });

	var explosion = new Explosion(missile.x, missile.y);
	this.explosions.push(explosion);
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
