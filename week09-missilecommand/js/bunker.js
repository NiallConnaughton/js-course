function Bunker(x, y) {
	this.x = x;
	this.y = y;
	this.isAlive = true;
}

Bunker.prototype.initialize = function(remainingMissiles) {
	this.remainingMissiles = remainingMissiles;
}

Bunker.prototype.fireMissile = function() {
	this.remainingMissiles--;
}