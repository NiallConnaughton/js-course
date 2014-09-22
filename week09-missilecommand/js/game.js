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
	this.cities.push(new City(120, 520));
	this.cities.push(new City(400, 500));
	this.cities.push(new City(620, 530));

	this.bunkers.push(new Bunker(30, 510));
	this.bunkers.push(new Bunker(300, 530));
	this.bunkers.push(new Bunker(720, 520));

	var canvas = document.getElementById('canvas');
	canvas.addEventListener('mousedown', this.fireDefenseMissile.bind(this));
	this.render();
	this.requestAnimationFrame();
}

Game.prototype.fireDefenseMissile = function(location) {
	console.log(location);
	var defenseMissile = this.createMissile(30, 500, location.offsetX, location.offsetY);
	this.defenseMissiles.push(defenseMissile);
}

Game.prototype.createMissile = function(sourceX, sourceY, targetX, targetY) {
	var missile = new Missile(sourceX, sourceY, targetX, targetY);
	missile.onExploded = this.onMissileExploded.bind(this);

	return missile;
}

Game.prototype.step = function (elapsed) {
	this.fireNewEnemyMissiles();
	this.updatePositions(elapsed);
	this.detectCollisions();
	this.render();
}

Game.prototype.fireNewEnemyMissiles = function() {
	if (Math.random() > 0.995) {
		var sourceX = Math.random() * $canvas.width();

		var targets = this.cities.concat(this.bunkers); // where is alive
		var target = targets[Math.floor(Math.random() * targets.length)];

		var missile = this.createMissile(sourceX, 0, target.x, target.y);

		this.enemyMissiles.push(missile);
	}
}

Game.prototype.render = function () {
	this.renderer.render();
}

Game.prototype.updatePositions = function(elapsed) {
	var updateables = this.enemyMissiles
						  .concat(this.defenseMissiles)
						  .concat(this.explosions)
						  .filter(function(o) { return o.isAlive; });

	updateables.forEach(function(u) { u.updatePosition(elapsed); } );
}

Game.prototype.detectCollisions = function() {
	var self = this;

	this.explosions.forEach(function(e) {
		var explodedMissiles = self.enemyMissiles
								   .concat(self.defenseMissiles)
								   .filter(function(m) { return m.isAlive && e.explodes(m); });

		explodedMissiles.forEach(function(m) {
			self.explosions.push(new Explosion(m.x, m.y));
			m.isAlive = false;
		});
	});

	this.explosions = this.explosions.filter(function(e) { return e.isAlive; });
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
