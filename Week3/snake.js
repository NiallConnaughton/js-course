var left = 37, right = 39;
var grid = [];
var directions = ['l', 'u', 'r', 'd'];
var snake = {
	direction: 2, // right,
	segments: [ { x: 20, y: 20 }, { x: 19, y: 20 } ]
};
var refreshInterval = 100;

function initializeGrid() {
	for (var i = 0; i < 40; i++) {
		var row = [];
		for (var j = 0; j < 40; j++) {
			row.push(' ');
		}
		grid.push(row);
	}

	$.each(snake.segments, function(_, segment) { setGridSquare(segment, 'O'); });
}

function render() {
	var content = [];

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

	updatePosition();
}

function updatePosition() {
	var currentDirection = directions[snake.direction];
	var newHead = { x: snake.segments[0].x, y: snake.segments[0].y };

	switch (currentDirection) {
		case 'l':
			newHead.x--;
			break;
		case 'u':
			newHead.y--;
			break;
		case 'r':
			newHead.x++;
			break;
		case 'd':
			newHead.y++;
			break;
	}

	// wrap the snake's head's position so it doesn't wander out of the grid
	newHead.x = (newHead.x + 40) % 40;
	newHead.y = (newHead.y + 40) % 40;

	snake.segments.unshift(newHead);
	var oldTail = snake.segments.pop();

	setGridSquare(newHead, 'O');
	setGridSquare(oldTail, ' ');
	// grid[newHead.y][newHead.x] = 'O';
	// grid[oldTail.y][oldTail.x] = ' '

	render();

	// console.log([newHead.x, newHead.y, directions[snake.direction]].join(', '));
}

function setGridSquare(position, value)
{
	grid[position.y][position.x] = value;
}

initializeGrid();
render();
$('body').keydown(handleKeyDown);
window.setInterval(updatePosition, refreshInterval);
