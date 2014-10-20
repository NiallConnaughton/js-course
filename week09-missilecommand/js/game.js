var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d'); 

function Game() {
	this.renderer = new Renderer();
	this.score = 0;
	this.updateRequests = this.getUpdateRequests();
	this.mouseDowns = Rx.Observable.fromEvent(canvas, "mousedown").share();
	this.level = new Level(1, this.updateRequests, this.mouseDowns);

	this.mouseDowns.take(1).subscribe(this.initialize.bind(this));
}

Game.prototype.initialize = function() {
	var self = this;
	this.level.initialize();

	this.updateRequests.takeUntil(this.level.levelFinished)
					   .subscribe(this.render.bind(this));

	this.level.levelFinished.subscribe(this.levelFinished.bind(this));
}

Game.prototype.levelFinished = function(levelWon) {
	if (levelWon) {
		var remainingMissiles = _(this.level.bunkers).reduce(
			function(total, bunker) { return total + bunker.remainingMissiles; },
			0);
		this.score += this.level.cities.length * 500 + remainingMissiles * 50;
		console.log('Level complete, score' + this.score);
		this.levelUp();
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
