function Renderer(game) {
	this.game = game;

	this.canvas = document.getElementById('canvas');
	this.context = this.canvas.getContext('2d');

	this.groundImg = this.loadImage('images/ground.png');
	this.cityImg = this.loadImage('images/city.png');
	this.bunkerImg = this.loadImage('images/bunker.png');
}

Renderer.prototype.loadImage = function(url) {
	var img = new Image();
	img.src = url;

	return img;
}

Renderer.prototype.render = function() {
	var self = this;

	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	this.renderGround();

	// should work out how to bind the functions to the game objects instead of using anonymous loop function
	this.game.cities.forEach(function(city) { self.renderCity.call(self, city); });
	this.game.bunkers.forEach(function(bunker) { self.renderBunker.call(self, bunker); });
	this.game.defenseMissiles.forEach(function(missile) { self.renderMissile.call(self, missile); });
	this.game.enemyMissiles.forEach(function(missile) { self.renderMissile.call(self, missile); });
	this.game.explosions.forEach(function(explosion) { self.renderExplosion.call(self, explosion); });
}

Renderer.prototype.renderGround = function() {
	ctx.save();
	var groundPattern = ctx.createPattern(this.groundImg, 'repeat-x');
	ctx.fillStyle = groundPattern;
	ctx.translate(0, 495);
	ctx.fillRect(0, 0, 800, 105);
	ctx.restore();
}

Renderer.prototype.renderCity = function(city) {
	this.renderImage(this.cityImg, city);
}

Renderer.prototype.renderBunker = function(bunker) {
	this.renderImage(this.bunkerImg, bunker);
}

Renderer.prototype.renderImage = function(img, gameObject) {
	ctx.drawImage(img, gameObject.x, gameObject.y);
}

Renderer.prototype.renderMissile = function(missile) {
	// first draw the missile trail
    this.context.beginPath();
    this.context.moveTo(missile.sourceX, missile.sourceY);
    this.context.lineTo(missile.x, missile.y);
    this.context.lineWidth = 1;
    this.context.strokeStyle = 'red';
    this.context.stroke();

	// then the missile itself over its trail
	this.context.beginPath();
	this.context.arc(missile.x, missile.y, 3, 0, 2 * Math.PI, false);
    this.context.fillStyle = 'blue';
    this.context.fill();
    this.context.lineWidth = 0;
    this.context.strokeStyle = 'black';
    this.context.stroke();
}

Renderer.prototype.renderExplosion = function(explosion) {
	this.context.beginPath();
	this.context.arc(explosion.x, explosion.y, explosion.size, 0, 2 * Math.PI, false);
    this.context.fillStyle = 'red';
    this.context.fill();
    this.context.lineWidth = 0;
    this.context.strokeStyle = 'black';
    this.context.stroke();
}