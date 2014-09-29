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

	var updateRequests = this.getUpdateRequests();
	var self = this;
	updateRequests.subscribe(function (timeDelta) { self.step(timeDelta); });
}

Game.prototype.fireDefenseMissile = function(target) {
	var closestBunker = _.min(this.bunkers, function(b) { return Math.abs(b.x - target.offsetX); });
	var defenseMissile = this.createMissile(closestBunker.x, closestBunker.y, target.offsetX, target.offsetY, 600);
	this.defenseMissiles.push(defenseMissile);
}

Game.prototype.createMissile = function(sourceX, sourceY, targetX, targetY, speed) {
	var missile = new Missile(sourceX, sourceY, targetX, targetY, speed);
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

		var missile = this.createMissile(sourceX, 0, target.x, target.y, 50);

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
		var explodedObjects = self.enemyMissiles.concat(self.bunkers).concat(self.cities)
								  .filter(function(m) { return m.isAlive && e.explodes(m); });

		explodedObjects.forEach(function(m) {
			self.explosions.push(new Explosion(m.x, m.y));
			m.isAlive = false;
		});
	});

	var removeDeadObjects = function(items) { return items.filter(function(i) { return i.isAlive; }); };
	this.explosions = removeDeadObjects(this.explosions);
	this.cities = removeDeadObjects(this.cities);
	this.bunkers = removeDeadObjects(this.bunkers);
}

Game.prototype.onMissileExploded = function(missile) {
	this.defenseMissiles = this.defenseMissiles.filter(function (m) { return m != missile });
	this.enemyMissiles = this.enemyMissiles.filter(function (m) { return m != missile; });

	var explosion = new Explosion(missile.x, missile.y);
	this.explosions.push(explosion);
}

Game.prototype.getUpdateRequests = function() {
	var updateRequests = Rx.Observable.create(function(observer) {
		var handleAnimationFrame = function(t) {
			observer.onNext(t);
			window.requestAnimationFrame(handleAnimationFrame);
		};

		window.requestAnimationFrame(handleAnimationFrame);	
	})
	.publish()
	.refCount();

	return updateRequests.zip(updateRequests.skip(1), function(t1, t2) { return t2 - t1; });
}

var game = new Game();
game.initialize();
