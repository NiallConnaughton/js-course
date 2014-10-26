function Missile(sourceX, sourceY, targetX, targetY, isDefenseMissile) {
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
}

Missile.prototype.reachedTarget = function() {
	var distanceFromLaunch = this.getDistance(this.sourceX, this.sourceY, this.x, this.y);
	return distanceFromLaunch >= this.targetDistance;
}

Missile.prototype.updatePosition = function(elapsed) {
	this.x += this.xSpeed * (elapsed / 1000);
	this.y += this.ySpeed * (elapsed / 1000);

	if (this.reachedTarget()) {
		this.x = this.targetX;
		this.y = this.targetY;
	}
}

Missile.prototype.getDistance = function(sourceX, sourceY, targetX, targetY) {
	var dx = targetX - sourceX;
	var dy = targetY - sourceY;
	return Math.sqrt(dx * dx + dy* dy);
}