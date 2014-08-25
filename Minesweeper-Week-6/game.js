function Game(board) {
	this.board = board;
}

Game.prototype.start = function() {
	board.initializeGrid();
	this.renderBoard();
	this.handleUserInput();

	board.onUpdateCell = this.cellUpdated;
}

Game.prototype.cellUpdated = function(cell) {
	//console.log('Updating cell ' + cell);

	var selector = '[data-x=' + cell.x + '][data-y=' + cell.y + ']';
	var $cell = $(selector);

	// don't want to do this when the update is a cell being flagged or unflagged
	$cell.removeClass('selectable');

	// console.log(cell);
	if (cell.isBomb) {
		alert('Game over, man!');
	}
	else if (cell.isFlagged) {
		$cell.toggleClass('flagged');
	}
	else {
		$cell.addClass('revealed');

		if (cell.neighbourBombs > 0) {
			$cell.addClass('bombs' + cell.neighbourBombs);
			$cell.html(cell.neighbourBombs);
		}
	}
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

		if (e.button === 0) {
			self.board.revealCellAt(x, y);
		}
		else if (e.button === 2) {
			// right click
			self.board.flagCellAt(x, y);
		}
	});
}