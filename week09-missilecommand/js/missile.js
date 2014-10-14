function Missile(sourceX, sourceY, targetX, targetY, isDefenseMissile, levelUpdates) {
	this.x = this.sourceX = sourceX;
	this.y = this.sourceY = sourceY;
	this.targetX = targetX;
	this.targetY = targetY;
	this.isDefenseMissile = isDefenseMissile;
	this.speed = isDefenseMissile ? 1000 : 50;

	this.targetDistance = this.getDistance(sourceX, sourceY, targetX, targetY);
	this.xSpeed = (targetX - sourceX) * this.speed / this.targetDistance;
	this.ySpeed = (targetY - sourceY) * this.speed / this.targetDistance;

	this.isAlive = true;

	var self = this;
	var detonation = levelUpdates.where(this.reachedTarget.bind(this));
	var destroyedByExplosion = levelUpdates.where(this.isDestroyedByExplosion.bind(this));

	self.onExploded = detonation.merge(destroyedByExplosion)
							 	.take(1)
							 	.map(function() { return self; });
}

Missile.prototype.isDestroyedByExplosion = function(levelState) {
	var self = this;
	return !this.isDefenseMissile && _.any(levelState.explosions, function(e) { return e.explodes(self); });
}

Missile.prototype.reachedTarget = function() {
	var distanceFromLaunch = this.getDistance(this.sourceX, this.sourceY, this.x, this.y);
	return distanceFromLaunch >= this.targetDistance;
}

Missile.prototype.updatePosition = function(elapsed) {
	this.x += this.xSpeed * (elapsed / 1000);
	this.y += this.ySpeed * (elapsed / 1000);
}

Missile.prototype.getDistance = function(sourceX, sourceY, targetX, targetY) {
	var dx = targetX - sourceX;
	var dy = targetY - sourceY;
	return Math.sqrt(dx * dx + dy* dy);
}