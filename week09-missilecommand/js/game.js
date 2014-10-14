var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d'); 

function Game() {
	this.renderer = new Renderer();
	this.score = 0;
	this.updateRequests = this.getUpdateRequests();
	this.level = new Level(1, this.updateRequests);
}

Game.prototype.initialize = function() {
	this.level.initialize();

	var gameLost = this.updateRequests.where(this.level.levelLost.bind(this.level))
								 	  .take(1);

	var levelWon = this.updateRequests.where(this.level.levelWon.bind(this.level))
									  .takeUntil(gameLost)
									  .take(1);

	gameLost.subscribe(function() { console.log('GAME OVER, MAN!'); });
	levelWon.subscribe(function() { console.log('WINNERS DON\'T USE DRUGS'); });

	this.level.getEnemyMissileLaunches()
			  .takeUntil(gameLost)
			  .subscribe(this.level.fireEnemyMissile.bind(this.level));

	Rx.Observable.fromEvent(canvas, "mousedown")
				 .takeUntil(levelWon.merge(gameLost))
				 .subscribe(this.level.fireDefenseMissile.bind(this.level));

	this.updateRequests.takeUntil(levelWon.merge(gameLost))
					   .subscribe(this.step.bind(this));

	levelWon.subscribe(this.levelUp.bind(this));
}

Game.prototype.levelUp = function() { 
	this.level = this.level.createNextLevel();
	this.initialize();
}

Game.prototype.step = function (elapsed) {
	// this.level.updatePositions(elapsed);

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
game.initialize();
