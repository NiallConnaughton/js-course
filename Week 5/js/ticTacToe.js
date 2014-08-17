console.log('Tic Tac Toe in Javascript');

var PLAYER_1 = 0, PLAYER_2 = 1, CELL_EMPTY = undefined;
var current_player = PLAYER_1;
var grid = [];
var moves = 0;

function initializeGrid() {
	var displayGrid = [];

	for (var i = 0; i < 3; i++) {
		var row = [];
		for (var j = 0; j < 3; j++) {
			row.push(CELL_EMPTY);

			var cellId = getCellId(j, i);
			var buttonId = 'button' + cellId;

			var cellHtml = '<div class="cell" id="' + cellId + '"><button id="' + buttonId + '" class="cellButton">foo</button> </div>';
			displayGrid.push(cellHtml);
		}
		grid.push(row);
	}

	var renderedContent = displayGrid.join('\n');
	$('#board').html(renderedContent);


	// for (var i = 0; i < 3; i++) {
	// 	for (var j = 0; j < 3; j++) {
	// 		cellId = getCellId(i, j);
	// 		button = $('#' + cellId + ' .cellButton');

	// 		button.click(function(x, y) {
	// 			console.log('clicked ' + x + ', ' + y);
	// 			placePiece(x, y, PLAYER_1);
	// 		}(i, j));
	// 	}
	// }
	var buttons = $('#board').find('.cellButton');

	buttons.click(function() {
		var clickedCell = $(this).parent().attr('id');
		var x = clickedCell[1];
		var y = clickedCell[3];

		placePiece(x, y, current_player);
	})
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

	moves++;
	current_player = (current_player + 1) % 2;

	checkGameState();
}

function checkGameState() {
	var consecutiveCellSets = [];
	
	// each column
	consecutiveCellSets.push(grid[0]);
	consecutiveCellSets.push(grid[1]);
	consecutiveCellSets.push(grid[2]);

	consecutiveCellSets.push([grid[0][0], grid[1][0], grid[2][0]]);
	consecutiveCellSets.push([grid[0][1], grid[1][1], grid[2][1]]);
	consecutiveCellSets.push([grid[0][2], grid[1][2], grid[2][2]]);

	for (var i = 0; i < consecutiveCellSets.length; i++) {
		var consecutiveSet = consecutiveCellSets[i];
		var sum = 0;
		for (var cell = 0; cell < 3; cell++) {
			sum += consecutiveSet[cell];
		}

		console.log(sum);

		if (sum === PLAYER_1 * 3) {
			alert('player 1 win!');
		}
		else if (sum === PLAYER_2 * 3) {
			alert('player 2 win!');
		}
	}

	if (moves === 9)
		alert('tie!');
}

function getCellId(x, y) {
	return 'x' + x + 'y' + y;
}

initializeGrid();

// placePiece(0, 0, PLAYER_1);
// placePiece(0, 1, PLAYER_1);
// placePiece(0, 2, PLAYER_1);

// checkGameState();