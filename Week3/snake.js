var left = 37, right = 39;
var grid = [];
var directions = ['l', 'u', 'r', 'd'];
var snake = {
	direction: 2, // right,
	position: [20,20]
};

function initializeGrid() {
	for (var i = 0; i < 40; i++) {
		var row = [];
		for (var j = 0; j < 40; j++) {
			row.push('&nbsp;');
		}
		grid.push(row);
	}
}

function render(grid) {
	var content = [];

	grid[snake.position[0]][snake.position[1]] = 'O';

	for (var rowIndex = 0; rowIndex < grid.length; rowIndex++) {
		var row = grid[rowIndex];
		for (var cellIndex = 0; cellIndex < row.length; cellIndex++) {
			var cell = row[cellIndex];
			content.push('<div class="cell">' + cell + '</div>');
		}
	}

	var renderedContent = content.join('\n');
	$('#content').html(renderedContent);
}

function handleKeyDown(eventData) {
	switch (eventData.which){
		case left:
			snake.direction = (snake.direction - 1 + 4) % 4;
			break;
		case right:
			snake.direction = (snake.direction + 1) % 4;
			break;
	}
}

function updatePosition() {
	var currentDirection = directions[snake.direction];
	switch (currentDirection) {
		case 'l':
			snake.position[0]--;
			break;
		case 'u':
			snake.position[1]--;
			break;
		case 'r':
			snake.position[0]++;
			break;
		case 'd':
			snake.position[1]++;
			break;
	}

	snake.position[0] = (snake.position[0] + 40) % 40;
	snake.position[1] = (snake.position[1] + 40) % 40;

	render();

	console.log(snake.position + ' ' + directions[snake.direction]);
}

initializeGrid();
render(grid);
$('body').keydown(handleKeyDown);
window.setInterval(updatePosition, 1000);
