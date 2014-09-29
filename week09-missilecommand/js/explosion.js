function Explosion(x, y) {
	this.x = x;
	this.y = y;
	this.size = 0;
	this.completed = false;

	this.isAlive = true;
}

Explosion.prototype.updatePosition = function(elapsed) {
	if (this.size < 30) {
		this.size += 20 * elapsed / 1000;
	}
	else if (this.isAlive) {
		this.isAlive = false;
	}
}

Explosion.prototype.explodes = function(other) {
	var distance = this.getDistance(this, other);

	return distance <= this.size;
}

Explosion.prototype.getDistance = function(source, target) {
	// Refactor this into something shared

	var dx = target.x - source.x;
	var dy = target.y - source.y;
	return Math.sqrt(dx * dx + dy* dy);
}