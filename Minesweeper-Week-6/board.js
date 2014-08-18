function Board(size, bombCount) {
	// var emptyCell = 0, bombCell = 1, flagCell = 2;
	this.cells = [];
	this.size = size;
	this.bombCount = bombCount;
}

Board.prototype.initializeGrid = function() {
	for (var i = 0; i < this.size; i++) {
		var row = [];
		for (var j = 0; j < this.size; j++) {
			row.push(new Cell());
		}
		this.cells.push(row);
	}

	this.placeBombs();

	console.log('Grid initialized');
}

Board.prototype.placeBombs = function() {
	for (var i = 0; i < this.bombCount; i++) {
		var bombPlaced = false;
		while (!bombPlaced) {
			var x = Math.floor(Math.random() * this.size + 1);
			var y = Math.floor(Math.random() * this.size + 1);

			var cell = this.cells[x][y];
			if (!cell.isBomb) {
				cell.isBomb = true;
				bombPlaced = true;

				console.log('Bomb at ' + x + ', ' + y);
			}
		}
	}
}
