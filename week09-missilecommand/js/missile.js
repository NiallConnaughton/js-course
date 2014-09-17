function Missile(sourceX, sourceY, targetX, targetY) {
	this.x = this.sourceX = sourceX;
	this.y = this.sourceY = sourceY;
	this.targetX = targetX;
	this.targetY = targetY;
	this.speed = 25;

	var dx = targetX - sourceX;
	var dy = targetY - sourceY;
	var length = Math.sqrt(dx * dx + dy* dy);
	this.xSpeed = dx * this.speed / length;
	this.ySpeed = dy * this.speed / length;
}

Missile.prototype.updatePosition = function(elapsed) {
	this.x += this.xSpeed * (elapsed / 1000);
	this.y += this.ySpeed * (elapsed / 1000);
}
