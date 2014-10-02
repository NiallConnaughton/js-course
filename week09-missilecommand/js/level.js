function Level(level) {
	this.cities = [];
	this.bunkers = [];
	this.enemyMissiles = [];
	this.defenseMissiles = [];
	this.explosions = [];
	this.level = level;
}

Level.prototype.initialize = function() {
	this.cities.push(new City(120, 520));
	this.cities.push(new City(400, 500));
	this.cities.push(new City(620, 530));

	this.bunkers.push(new Bunker(30, 510, 10));
	this.bunkers.push(new Bunker(300, 530, 10));
	this.bunkers.push(new Bunker(720, 520, 10));

	this.totalEnemyMissiles = 10 + this.level * 10;
	this.remainingEnemyMissiles = this.totalEnemyMissiles;
}

Level.prototype.levelWon = function() {
	// the level is won when there are no more missiles remaining to be fired, none in flight,
	// and no explosions that could possibly still kill a city

	return this.remainingEnemyMissiles === 0 && !_.any(this.enemyMissiles) && !_.any(this.explosions);
}

Level.prototype.levelLost = function() {
	return !_.any(this.cities); 
}

Level.prototype.onMissileExploded = function(missile) {
	this.defenseMissiles = this.defenseMissiles.filter(function (m) { return m != missile });
	this.enemyMissiles = this.enemyMissiles.filter(function (m) { return m != missile; });

	var explosion = new Explosion(missile.x, missile.y);
	this.explosions.push(explosion);
}

Level.prototype.fireEnemyMissile = function() {
	var sourceX = Math.random() * canvas.width;

	var targets = this.cities.concat(this.bunkers);
	var target = targets[Math.floor(Math.random() * targets.length)];

	var missile = this.createMissile(sourceX, 0, target.x, target.y, 50);

	this.enemyMissiles.push(missile);
	this.remainingEnemyMissiles--;
}

Level.prototype.fireDefenseMissile = function(target) {
	var remainingBunkers = this.bunkers.filter(function(b) { return b.remainingMissiles > 0; });

	if (_.any(remainingBunkers)) {
		var closestBunker = _.min(remainingBunkers, function(b) { return Math.abs(b.x - target.offsetX); });
		closestBunker.fireMissile();

		var defenseMissile = this.createMissile(closestBunker.x, closestBunker.y, target.offsetX, target.offsetY, 600);
		this.defenseMissiles.push(defenseMissile);
	}
}

Level.prototype.createMissile = function(sourceX, sourceY, targetX, targetY, speed) {
	var missile = new Missile(sourceX, sourceY, targetX, targetY, speed);
	missile.onExploded = this.onMissileExploded.bind(this);

	return missile;
}

Level.prototype.updatePositions = function(elapsed) {
	var updateables = this.enemyMissiles
						  .concat(this.defenseMissiles)
						  .concat(this.explosions);

	updateables.forEach(function(u) { u.updatePosition(elapsed); } );

	this.checkForDestroyedObjects();
}

Level.prototype.checkForDestroyedObjects = function() {
	var self = this;

	this.explosions.forEach(function(e) {
		var explodedObjects = self.enemyMissiles.concat(self.bunkers).concat(self.cities)
								  .filter(function(m) { return m.isAlive && e.explodes(m); });

		explodedObjects.forEach(function(m) {
			self.explosions.push(new Explosion(m.x, m.y));
			m.isAlive = false;
		});
	});

	this.removeDeadObjects(this.explosions);
	this.removeDeadObjects(this.cities);
	this.removeDeadObjects(this.bunkers);
	this.removeDeadObjects(this.enemyMissiles);
}

Level.prototype.removeDeadObjects = function(items) {
	for (var i = items.length - 1; i >= 0; i--) {
		if (!items[i].isAlive) {
			items.splice(i, 1);
		}
	}
}

Level.prototype.getEnemyMissileLaunches = function() {
	// generate a sequence of relative launch times, randomly between 0 and 10 seconds apart

	var averageGap = 60000 / this.totalEnemyMissiles;

	var delays = [];
	for (var i = 0; i < this.totalEnemyMissiles; i++) {
		delays.push(Math.random() * averageGap * 2);
	}

	// take the launch times and map them to observable timers that will fire at the launch time
	return Rx.Observable.for(delays, function(d) { return Rx.Observable.timer(d); });
	
	// for great justice, replace the line above with this. No idea why it does that.
	// return Rx.Observable.for(delays, Rx.Observable.timer);
}