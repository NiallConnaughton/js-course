function Renderer(game) {
	this.game = game;
}

Renderer.prototype.render = function() {
	this.renderGround();
}

Renderer.prototype.renderGround = function() {
	var groundImg = new Image();
	groundImg.src = 'images/ground.png';
	groundImg.onload = function() {
		var groundPattern = ctx.createPattern(groundImg, 'repeat-x');
		ctx.fillStyle = groundPattern;
		ctx.translate(0, 495);
		ctx.fillRect(0, 0, 800, 105);
	}
}
