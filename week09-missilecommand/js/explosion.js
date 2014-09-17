function Explosion(x, y) {
	this.x = x;
	this.y = y;
	this.size = 0;
	this.completed = false;
}

Explosion.prototype.updatePosition = function(elapsed) {
	if (this.size < 30) {
		this.size += 10 * elapsed / 1000;
	}
}
