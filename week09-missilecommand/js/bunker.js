function Bunker(location) {
	this.location location;
	this.isAlive = true;
}

Bunker.prototype.initialize = function(remainingMissiles) {
	this.remainingMissiles = remainingMissiles;
}

Bunker.prototype.fireMissile = function() {
	this.remainingMissiles--;
}