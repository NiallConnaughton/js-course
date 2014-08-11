console.log('Tic Tac Toe in Javascript');

var CELL_EMPTY = 0, PLAYER_1 = 1, PLAYER_2 = 2;
var grid = [];

function initializeGrid() {
	var displayGrid = [];

	for (var i = 0; i < 3; i++) {
		var row = [];
		for (var j = 0; j < 3; j++) {
			row.push(CELL_EMPTY);

			var cellId = getCellId(j, i);
			displayGrid.push('<div class="cell" id="' + cellId + '"> </div>');
		}
		grid.push(row);
	}

	var renderedContent = displayGrid.join('\n');
	$('#board').html(renderedContent);
}

function placePiece(x, y, player) {
	grid[x][y] = player;

	var cellId = getCellId(x, y);
	var cell = $('#' + cellId);
	var cellClass = 'player' + player;

	cell.addClass(cellClass);
	if (player === PLAYER_1)
		cell.html('X');
	else if (player === PLAYER_2)
		cell.html('O');
}

function getCellId(x, y) {
	return 'x' + x + 'y' + y;
}

initializeGrid();

placePiece(1, 1, PLAYER_1);
placePiece(1, 2, PLAYER_2);
