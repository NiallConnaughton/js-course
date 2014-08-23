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
			row.push(new Cell(j, i));
		}
		this.cells.push(row);
	}

	// console.log(this.cells[2]);

	this.initializeNeighbours();
	this.placeBombs();

	console.log('Grid initialized');
}

Board.prototype.placeBombs = function() {
	for (var i = 0; i < this.bombCount; i++) {
		var bombPlaced = false;
		while (!bombPlaced) {
			var x = Math.floor(Math.random() * this.size);
			var y = Math.floor(Math.random() * this.size);

			var cell = this.cells[x][y];
			if (!cell.isBomb) {
				cell.isBomb = true;
				bombPlaced = true;

				// console.log('Bomb at ' + x + ', ' + y);

				cell.neighbours.forEach(function (c) {
					c.addNeighbourBomb();
				});
			}
		}
	}
}

Board.prototype.initializeNeighbours = function() {
	for (var x = 0; x < this.size; x++) {
		for (var y = 0; y < this.size; y++) {
			var cell = this.cells[x][y];
			var neighbours = this.getNeighbours(cell);
			cell.neighbours = neighbours;
		}
	}
}

Board.prototype.getNeighbours = function(cell) {
	// neighbours are the cells from one column left, one row above to one column right, one row below the cell
	// but we need to handle the case where the cell is on the topmost/leftmost/rightmost/bottommost row/column

	var left = Math.max(cell.x - 1, 0);
	var top = Math.max(cell.y - 1, 0);
	var right = Math.min(cell.x + 1, this.size - 1);
	var bottom = Math.min(cell.y + 1, this.size - 1);

	var neighbours = [];

	for (var x = left; x <= right; x++) {
		for (var y = top; y <= bottom; y++) {
			// make sure the cell is not its own neighbour
			if (x === cell.x && y === cell.y) {
				continue;
			}

			neighbours.push(this.cells[x][y]);
		}
	}

	return neighbours;
}
