function Game(board) {
	this.board = board;
}

Game.prototype.start = function() {
	board.initializeGrid();
	this.renderBoard();
	this.handleUserInput();
}

Game.prototype.renderBoard = function() {
	console.log('rendering');
	var boardDiv = $('#board');

	for (var y = 0; y < this.board.size; y++) {
		var row = [];
		row.push('<div class="row">');
		for (var x = 0; x < this.board.size; x++) {
			row.push('<div class="cell selectable" data-x="' + x + '" data-y="' + y + '"> </div>');
		}

		boardDiv.append(row.join('\n'));
	}
}

Game.prototype.handleUserInput = function() {
	// Suppress the context menu for right click
	window.oncontextmenu = function() { return false; };

	var cells = $('#board').find('.cell');
	var self = this;

	// handle click events on any of the cells, and place a piece there
	cells.mousedown(function(e) {
		var x = $(this).attr('data-x');
		var y = $(this).attr('data-y');

		// self.board.logNeighbours(x, y);

		if (e.button === 0) {
			if (self.board.cellHasBomb(x, y)) {
				alert('Game over, man!');
			}
		}
		else if (e.button === 2) {
			// right click
			var selector = '[data-x=' + x + '][data-y=' + y + ']';
			$(selector).toggleClass('flagged');
		}
	});
}
