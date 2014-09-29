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

	var render = function(items, renderFunc) {
		items.filter(function (i) { return i.isAlive; })
		.forEach(renderFunc.bind(self));
	}

	// should work out how to bind the functions to the game objects instead of using anonymous loop function
	render(this.game.cities, this.renderCity);
	render(this.game.bunkers, this.renderBunker);
	render(this.game.defenseMissiles.concat(this.game.enemyMissiles), this.renderMissile);
	render(this.game.explosions, this.renderExplosion);
}

Renderer.prototype.isAlive = function(obj) {
	return obj.isAlive;
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
	var top = gameObject.y - img.height / 2;
	var left = gameObject.x - img.width / 2;
	ctx.drawImage(img, left, top);
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
	var nonRedColour = Math.floor(255 * explosion.size / 30);
	var nonRedColourHex = ('00' + nonRedColour.toString(16)).slice(-2); 
	var colour = '#FF' + nonRedColourHex + nonRedColourHex;

	this.context.beginPath();
	this.context.arc(explosion.x, explosion.y, explosion.size, 0, 2 * Math.PI, false);
    this.context.fillStyle = colour;
    this.context.fill();
    this.context.lineWidth = 0;
    this.context.strokeStyle = colour;
    this.context.stroke();
}