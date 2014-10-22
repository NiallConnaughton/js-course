var canvas = document.getElementById('canvas');
var $canvas = $(canvas);
var ctx = canvas.getContext('2d');

function Game() {
	this.renderer = new Renderer();
	this.score = 0;
	this.updateRequests = this.getUpdateRequests();
	this.mouseDowns = Rx.Observable.fromEvent(canvas, "mousedown").share();
	this.level = new Level(1, this.updateRequests, this.mouseDowns);

	this.mouseDowns.take(1).subscribe(this.initialize.bind(this));

	this.centreElement($canvas);
}

Game.prototype.initialize = function() {
	var self = this;
	this.level.initialize();

	this.updateRequests.takeUntil(this.level.levelFinished)
					   .subscribe(this.render.bind(this));

	this.level.levelFinished.subscribe(this.levelFinished.bind(this));
}

Game.prototype.centreElement = function($element) {
	var left = ($(document.body).width() - $element.width()) / 2;
	var top = ($(document.body).height() - $element.height()) / 2;
	$element.css({left: left, top: top});
}

Game.prototype.levelFinished = function(levelWon) {
	if (levelWon) {
		var remainingMissiles = _(this.level.bunkers).reduce(
			function(total, bunker) { return total + bunker.remainingMissiles; },
			0);

		this.score += this.level.cities.length * 500
						+ this.level.bunkers.length * 200
						+ remainingMissiles * 50;

		console.log('Level complete, score' + this.score);
		this.levelUp();
	}
	else {
		var $gameover = $('#gameover');
		$gameover.toggleClass('dialogHidden');
		this.centreElement($gameover);

		// var canvasPosition = $canvas.position();
		// var gameoverLeft = canvasPosition.left + ($canvas.width() - $gameover.width()) / 2;

		// console.log(canvasPosition);
		// console.log($canvas.width());
		// console.log($gameover.width());

		// $gameover.css({left: gameoverLeft});
	}
}

Game.prototype.levelUp = function() { 
	this.level = this.level.createNextLevel();
	this.initialize();
}

Game.prototype.render = function () {
	this.renderer.render(this.level);
}

Game.prototype.getUpdateRequests = function() {
	var updateRequests = Rx.Observable.create(function(observer) {
		var handleAnimationFrame = function(t) {
			observer.onNext(t);
			window.requestAnimationFrame(handleAnimationFrame);
		};

		window.requestAnimationFrame(handleAnimationFrame);	
	})
	.publish()
	.refCount();

	return updateRequests.zip(updateRequests.skip(1), function(t1, t2) { return t2 - t1; });//.sample(1000);
}

var game = new Game();
