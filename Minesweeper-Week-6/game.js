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

	for (var x = 0; x < 40; x++) {
		var row = [];
		row.push('<div class="row">');
		for (var y = 0; y < 40; y++) {
			row.push('<div class="cell selectable" data-x="' + x + '" data-y="' + y + '"> </div>');
		}

		boardDiv.append(row.join('\n'));
	}
}

Game.prototype.handleUserInput = function() {
	// Suppress the context menu for right click
	window.oncontextmenu = function() { return false; };

	var cells = $('#board').find('.cell');

	// handle click events on any of the cells, and place a piece there
	cells.mousedown(function(e) {
		var x = $(this).attr('data-x');
		var y = $(this).attr('data-y');

		if (e.button === 0) {
			// left click
		}
		else if (e.button === 2) {
			// right click
		}
	});
}