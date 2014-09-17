function Missile(sourceX, sourceY, targetX, targetY) {
	this.x = this.sourceX = sourceX;
	this.y = this.sourceY = sourceY;
	this.targetX = targetX;
	this.targetY = targetY;
	this.speed = 50;
	this.exploded = false;

	this.targetDistance = this.getDistance(sourceX, sourceY, targetX, targetY);
	this.xSpeed = (targetX - sourceX) * this.speed / this.targetDistance;
	this.ySpeed = (targetY - sourceY) * this.speed / this.targetDistance;
}

Missile.prototype.onExploded = function(missile) {
	// placeholder for callback
}

Missile.prototype.updatePosition = function(elapsed) {
	this.x += this.xSpeed * (elapsed / 1000);
	this.y += this.ySpeed * (elapsed / 1000);

	var distanceFromLaunch = this.getDistance(this.sourceX, this.sourceY, this.x, this.y);
	if (!this.exploded && distanceFromLaunch >= this.targetDistance) {
		this.onExploded(this);
		this.exploded = true;
	}
}

Missile.prototype.getDistance = function(sourceX, sourceY, targetX, targetY) {
	var dx = targetX - sourceX;
	var dy = targetY - sourceY;
	return Math.sqrt(dx * dx + dy* dy);
}