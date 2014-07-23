var grid = [];
var directions = ['l', 'u', 'r', 'd'];
var snake = {
	direction: 2, // right,
	segments: [ { x: 20, y: 20 }, { x: 19, y: 20 } ]
};
var refreshInterval = 400;
var gameInterval;
var isPaused = true;
var displayGrid = [];

function initializeGrid() {
	for (var i = 0; i < 40; i++) {
		var row = [];
		for (var j = 0; j < 40; j++) {
			row.push(' ');

			var cellId = getCellId(j, i);
			displayGrid.push('<div class="cell" id="' + cellId + '"> </div>');
		}
		grid.push(row);
	}
}

function getCellId(x, y) {
	return 'x' + x + 'y' + y;
}

function render() {
	var renderedContent = displayGrid.join('\n');

	$('#content').html(renderedContent);
	
	$.each(snake.segments, function(_, segment) { setGridSquare(segment, 'O'); });
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
			speedUp();
			break;

		case 'O':
			gameOver();
			break;
	}
}

function setGridSquare(position, value) {
	grid[position.y][position.x] = value;

	var cellId = getCellId(position.x, position.y);
	$('#' + cellId).html(value);
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

function speedUp() {
	refreshInterval *= 0.9;
	stopGameClock();
	startGameClock();
}

function togglePause() {
	isPaused = !isPaused;

	console.log('Setting paused to ' + isPaused);

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

render();

for (var i = 0; i < 3; i++) {
	addFood();
}

$('body').keydown(handleKeyDown);
// togglePause();