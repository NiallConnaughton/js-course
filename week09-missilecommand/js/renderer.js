function Renderer(game) {
	this.game = game;
}

Renderer.prototype.render = function() {
	var self = this;
	this.renderGround();

	this.game.cities.forEach(function(city) { self.renderCity.call(self, city); });
}

Renderer.prototype.renderGround = function() {
	var groundImg = new Image();
	groundImg.src = 'images/ground.png';
	groundImg.onload = function() {
		ctx.save();
		var groundPattern = ctx.createPattern(groundImg, 'repeat-x');
		ctx.fillStyle = groundPattern;
		ctx.translate(0, 495);
		ctx.fillRect(0, 0, 800, 105);
		ctx.restore();
	}
}

Renderer.prototype.renderCity = function(city) {
	console.log(this);
	this.renderImage('images/city.png', city);
}

Renderer.prototype.renderImage = function(url, gameObject) {
	// Should change this to pass in preloaded images
	var img = new Image();
	img.src = url;
	img.onload = function() {
		ctx.drawImage(img, gameObject.x, gameObject.y);
	}
}