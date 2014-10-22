var canvas = document.getElementById('canvas');
var $canvas = $(canvas);
var $gameover = $('#gameover');
var $mainMenuDialog = $('#mainMenu');
var $startGameButton = $('#startNewGameButton');
var ctx = canvas.getContext('2d');

function Game() {
	this.renderer = new Renderer();
	this.updateRequests = this.getUpdateRequests();
	this.mouseDowns = Rx.Observable.fromEvent(canvas, "mousedown").share();

	$startGameButton.click(this.startNewGame.bind(this));
	this.centreElement($canvas);
}

Game.prototype.showMainMenu = function() {
	this.showDialogs($mainMenuDialog);
	this.hideDialogs($gameover);
}

Game.prototype.startNewGame = function() {
	var self = this;
	this.score = 0;

	this.hideDialogs($mainMenuDialog, $gameover);

	this.level = new Level(1, this.updateRequests, this.mouseDowns);
	this.startLevel();
}

Game.prototype.startLevel = function() {
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
		this.showDialogs($gameover);
		Rx.Observable.timer(10000).subscribe(this.showMainMenu.bind(this));
		$('#finalScore').html(this.score);
		$('#finalLevel').html(this.level.level);
	}
}

Game.prototype.levelUp = function() {
	console.log(this);
	this.level = this.level.createNextLevel();
	this.startLevel();
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

Game.prototype.showDialogs = function() {
	for (var i = 0; i < arguments.length; i++) {
		this.centreElement(arguments[i]);
		arguments[i].removeClass('dialogHidden');
	};
}

Game.prototype.hideDialogs = function() {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].addClass('dialogHidden');
	};
}


var game = new Game();
game.showMainMenu();
