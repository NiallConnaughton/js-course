function Explosion(x, y) {
	this.x = x;
	this.y = y;
	this.size = 0;
	this.completed = false;

	this.isAlive = true;
}

Explosion.prototype.updatePosition = function(elapsed) {
	if (this.size < 30) {
		this.size += 10 * elapsed / 1000;
	}
	else if (this.isAlive) {
		this.isAlive = false;
	}
}

Explosion.prototype.explodes = function(other) {
	var distance = this.getDistance(this.x, this.y, other.x, other.y);

	return distance <= this.size;
}

Explosion.prototype.getDistance = function(sourceX, sourceY, targetX, targetY) {
	// Refactor this into something shared

	var dx = targetX - sourceX;
	var dy = targetY - sourceY;
	return Math.sqrt(dx * dx + dy* dy);
}