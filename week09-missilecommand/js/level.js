function Level(level, updateRequests, userClicks, previousLevel) {
	this.cities = [];
	this.bunkers = [];
	this.enemyMissiles = [];
	this.defenseMissiles = [];
	this.explosions = [];

	this.level = level;
	this.updateRequests = updateRequests;
	this.userClicks = userClicks;
	this.previousLevel = previousLevel;
}

Level.prototype.initialize = function() {
	if (this.previousLevel) {
		this.initializeFromPreviousLevel(this.previousLevel);
	}
	else {
		this.initializeNewLevel();
	}

	var totalDefenseMissiles = 20 + this.level * 3;
	var missilesPerBunker = Math.floor(totalDefenseMissiles / this.bunkers.length);
	this.bunkers.forEach(function(b) { b.initialize(missilesPerBunker); });

	this.totalEnemyMissiles = 5 + this.level * 5;
	this.remainingEnemyMissiles = this.totalEnemyMissiles;

	var levelUpdates = this.updateRequests.do(this.updatePositions.bind(this)).share();

	var detonations = this.getAllObjectUpdates(levelUpdates)
						  .where(this.hasObjectExploded.bind(this));

	var launches = this.getEnemyMissileLaunches()
					   .merge(this.getDefenseMissileLaunches())
					   .subscribe(this.launchMissile.bind(this));

	detonations.subscribe(this.objectExploded.bind(this));
}

Level.prototype.getAllObjectUpdates = function(levelUpdates) {
	// Generates an observable of position updates of all live level objects
	var self = this;
	return levelUpdates.flatMap(function() { return Rx.Observable.fromArray(self.getAllObjects.call(self)); });
}

Level.prototype.getAllObjects = function() {
	return this.cities.concat(this.bunkers).concat(this.enemyMissiles).concat(this.defenseMissiles);
}

Level.prototype.hasObjectExploded = function(obj) {
	if (obj.reachedTarget && obj.reachedTarget()) {
		return true;
	}

	// Defense missiles don't get destroyed by explosions, as this makes the game very hard to play (this matches the original)
	return !obj.isDefenseMissile && _.any(this.explosions, function(e) { return e.explodes(obj); });
}

Level.prototype.initializeNewLevel = function() {
	this.cities.push(new City(120, 520));
	this.cities.push(new City(400, 500));
	this.cities.push(new City(620, 530));

	this.bunkers.push(new Bunker(30, 510));
	this.bunkers.push(new Bunker(300, 530));
	this.bunkers.push(new Bunker(720, 520));
}

Level.prototype.initializeFromPreviousLevel = function(previousLevel) {
	this.cities = [].concat(previousLevel.cities);
	this.bunkers = [].concat(previousLevel.bunkers);
}

Level.prototype.createNextLevel = function() {
	return new Level(this.level + 1, this.updateRequests, this.userClicks, this);
}

Level.prototype.levelWon = function() {
	// the level is won when there are no more missiles remaining to be fired, none in flight,
	// and no explosions that could possibly still kill a city

	return this.remainingEnemyMissiles === 0 && !_.any(this.enemyMissiles) && !_.any(this.explosions);
}

Level.prototype.levelLost = function() {
	return !_.any(this.cities) && !_.any(this.explosions); 
}

Level.prototype.objectExploded = function(obj) {
	obj.isAlive = false;
	this.explosions.push(new Explosion(obj.x, obj.y));
}

Level.prototype.launchMissile = function(missile) {
	if (missile.isDefenseMissile) {
		this.defenseMissiles.push(missile);
	}
	else {
		this.enemyMissiles.push(missile);
		this.remainingEnemyMissiles--;
	}
}

Level.prototype.createEnemyMissile = function() {
	var sourceX = Math.random() * canvas.width;

	var targets = this.cities.concat(this.bunkers);
	var target = targets[Math.floor(Math.random() * targets.length)];

	if (target)
		return new Missile(sourceX, 0, target.x, target.y, false);
}

Level.prototype.createDefenseMissile = function(target) {
	var remainingBunkers = this.bunkers.filter(function(b) { return b.remainingMissiles > 0; });

	if (_.any(remainingBunkers)) {
		var closestBunker = _.min(remainingBunkers, function(b) { return Math.abs(b.x - target.offsetX); });
		closestBunker.fireMissile();

		return new Missile(closestBunker.x, closestBunker.y, target.offsetX, target.offsetY, true);
	}
}

Level.prototype.updatePositions = function(elapsed) {
	var updateables = this.enemyMissiles
						  .concat(this.defenseMissiles)
						  .concat(this.explosions);

	updateables.forEach(function(u) { u.updatePosition(elapsed); } );

	this.checkForDestroyedObjects();
}

Level.prototype.checkForDestroyedObjects = function() {
	this.removeDeadObjects(this.explosions);
	this.removeDeadObjects(this.cities);
	this.removeDeadObjects(this.bunkers);
	this.removeDeadObjects(this.enemyMissiles);
	this.removeDeadObjects(this.defenseMissiles);
}

Level.prototype.removeDeadObjects = function(items) {
	for (var i = items.length - 1; i >= 0; i--) {
		if (!items[i].isAlive) {
			items.splice(i, 1);
		}
	}
}

Level.prototype.getDefenseMissileLaunches = function() {
	return this.userClicks
			   .map(this.createDefenseMissile.bind(this))
			   .takeWhile(function(m) { return m; })	
}

Level.prototype.getEnemyMissileLaunches = function() {
	// level should last around 15 seconds

	var averageGap = 15000 / this.totalEnemyMissiles;

	console.log('level ' + this.level + ': ' + this.totalEnemyMissiles + ' missiles, launched every ' + averageGap + 'ms.');

	var delays = [];
	for (var i = 0; i < this.totalEnemyMissiles; i++) {
		delays.push(Math.random() * averageGap * 2);
	}

	// var self = this;
	// take the launch times and map them to observable timers that will fire at the launch time
	return Rx.Observable.for(delays, function(d) { return Rx.Observable.timer(d); })
						.map(this.createEnemyMissile.bind(this))
						.takeWhile(function(m) { return m; });
	
	// for great justice, replace the line above with this. No idea why it does that.
	// return Rx.Observable.for(delays, Rx.Observable.timer);
}