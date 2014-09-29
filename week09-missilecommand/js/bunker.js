function Bunker(x, y, missileCount) {
	this.x = x;
	this.y = y;
	this.remainingMissiles = missileCount;
	this.isAlive = true;
}

Bunker.prototype.fireMissile = function() {
	this.remainingMissiles--;
}