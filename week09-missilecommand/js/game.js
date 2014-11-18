var canvas = document.getElementById('canvas');
var $canvas = $(canvas);
var $gameover = $('#gameover');
var $mainMenuDialog = $('#mainMenu');
var $startGameButton = $('#startNewGameButton');
var $replayLastGameButton = $('#replayLastGameButton');
var ctx = canvas.getContext('2d');

function Game() {
	this.renderer = new Renderer();
	this.updateRequests = this.getUpdateRequests();
	this.mouseDowns = Rx.Observable.fromEvent(canvas, "mousedown").share();

	$startGameButton.click(this.startNewGame.bind(this));
	$replayLastGameButton.click(this.replayLastGame.bind(this));
	this.centreElement($canvas);
}

Game.prototype.showMainMenu = function() {
	this.showDialogs($mainMenuDialog);
	this.hideDialogs($gameover);
}

Game.prototype.startNewGame = function() {
	this.levels = [];
	this.score = 0;

	this.hideDialogs($mainMenuDialog, $gameover);

	var launchProvider = new LaunchProvider(this.mouseDowns);
	this.level = new Level(1, this.updateRequests, this.mouseDowns, null, launchProvider);
	this.startLevel();
}

Game.prototype.replayLastGame = function() {
	this.hideDialogs($mainMenuDialog, $gameover);
	var game = this.loadGame(sessionStorage.getItem('lastGame'));

	var launchProvider = new ReplayLaunchProvider(game);

	this.level = new Level(1, this.updateRequests, Rx.Observable.never(), null, launchProvider);
	this.level.launches = game.levels[0].launches;
	this.startLevel(true);
}

Game.prototype.loadGame = function(savedGame) {
	var game = JSON.parse(savedGame);

	this.levels = new Array(game.levels.length);
	console.log('Replaying ' + this.levels.length + ' levels');

	var launchedMissiles = _(game.levels)
						.pluck('launches')
						.flatten()
						.pluck('missile');

	var locations = launchedMissiles
						.map(function (missile) { return [ missile.source, missile.target, missile.location ]})
						.flatten()
						.value();

	// find a better way of doing this
	locations.forEach(function(l) { console.log(l); $.extend(l, Location.prototype); } );

	return game;	
}

Game.prototype.startLevel = function(isReplay) {
	this.level.initialize(isReplay);

	this.updateRequests.takeUntil(this.level.levelFinished)
					   .subscribe(this.render.bind(this));

	this.level.levelFinished.subscribe(this.levelFinished.bind(this));

	this.levels.push(this.level);
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

		var savedGame = this.getSavedGame();
		sessionStorage.setItem('lastGame', JSON.stringify(savedGame));
	}
}

Game.prototype.getSavedGame = function() {
	var levelLaunches = this.levels.map(function(l) { return { launches: l.launches }; });
	return { score: this.score, levels: levelLaunches };
}

Game.prototype.levelUp = function() {
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
	.share();

	return updateRequests.zip(updateRequests.skip(1), function(t1, t2) { return t2 - t1; });
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

Game.prototype.centreElement = function($element) {
	var left = ($(document.body).width() - $element.width()) / 2;
	var top = ($(document.body).height() - $element.height()) / 2;
	$element.css({left: left, top: top});
}

var game = new Game();
game.showMainMenu();
