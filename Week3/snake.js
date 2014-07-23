var grid = [];
var directions = ['l', 'u', 'r', 'd'];
var snake = {
	direction: 2, // right,
	segments: [ { x: 20, y: 20 }, { x: 19, y: 20 } ]
};
var refreshInterval = 100;
var gameInterval;
var isPaused = true;

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
	var left = 37, right = 39, pause = 'P'.charCodeAt(0);
	var newDirection = null;

	switch (eventData.which){
		case left:
			newDirection = (snake.direction - 1 + 4) % 4;
			break;

		case right:
			newDirection = (snake.direction + 1) % 4;
			break;

		case pause:
			togglePause();
			break;

		default:
			console.log('Unrecognised keydown: ' + eventData.which);
			break;
	}

	if (newDirection != null && !isPaused) {
		snake.direction = newDirection;
		updatePosition();
	}
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

	var newHeadCellValue = getGridValue(newHead);

	setGridSquare(newHead, 'O');

	// If the snake moves into an empty square, remove its old tail.
	// If it eats som food, replace the food we just ate with a new one.
	// If it hits itself, the game is over.
	switch (newHeadCellValue) {
		case ' ':
			var oldTail = snake.segments.pop();
			setGridSquare(oldTail, ' ');
			break;

		case '@':
			addFood();
			break;

		case 'O':
			gameOver();
			break;
	}

	render();
}

function setGridSquare(position, value) {
	grid[position.y][position.x] = value;
}

function getGridValue(position) {
	return grid[position.y][position.x];
}

function addFood() {
	var x = Math.floor(Math.random() * 40);
	var y = Math.floor(Math.random() * 40);
	var position =  { x: x, y: y };
	setGridSquare(position, '@');
}

function startGameClock() {
	gameInterval = window.setInterval(updatePosition, refreshInterval);
}

function stopGameClock() {
	window.clearInterval(gameInterval);
}

function togglePause() {
	isPaused = !isPaused;

	if (isPaused)
		stopGameClock();
	else
		startGameClock();
}

function gameOver() {
	stopGameClock();
	$('#content').addClass('gameOver');
	$('body').off('keydown');
}

initializeGrid();

for (var i = 0; i < 3; i++) {
	addFood();
}

render();
$('body').keydown(handleKeyDown);
togglePause();