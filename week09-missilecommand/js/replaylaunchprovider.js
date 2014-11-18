function ReplayLaunchProvider(replayGame) {
	this.game = replayGame;
}

ReplayLaunchProvider.prototype.getLaunches = function(level) {
	return this.getReplayedDefenseLaunches(level).merge(this.getReplayedEnemyMissileLaunches(level));
}

ReplayLaunchProvider.prototype.getReplayedDefenseLaunches = function(level) {
	var defenseLaunches = this.getReplayedLaunches(level)
							  .where(function(missile) { return missile.isDefenseMissile; })
							  .do(function(missile) {
								   		var bunker = level.findClosestBunker(missile.source);
								   		bunker.fireMissile();
									});

	return defenseLaunches;
}

ReplayLaunchProvider.prototype.getReplayedEnemyMissileLaunches = function(level) {
	return this.getReplayedLaunches(level).where(function(missile) { return !missile.isDefenseMissile; });
}

ReplayLaunchProvider.prototype.getReplayedLaunches = function(level) {
	var enemyMissiles = Rx.Observable.fromArray(level.launches)
									 .map(function (l) {
									 	var missile = new Missile(l.missile.source, l.missile.target, l.missile.isDefenseMissile);
									 	return Rx.Observable.return(missile).delay(l.timeOffset);
								 	 })
								 	 .mergeAll();

	return enemyMissiles;
}