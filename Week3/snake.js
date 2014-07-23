var grid = [];
var directions = ['l', 'u', 'r', 'd'];
var snake = {
	direction: 'r',
	segments: [ { x: 20, y: 20 }, { x: 19, y: 20 } ]
};
var refreshInterval = 300;
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
	var directions = { 37: 'l', 38: 'u', 39: 'r', 40: 'd' };
	var left = 37, up = 38, right = 39, down = 40;
	var pause = 'P'.charCodeAt(0);

	var selectedDirection = directions[eventData.which];

	if (selectedDirection) {
		var oldAndNew = snake.direction + selectedDirection;
		var ignoredDirectionChanges = ['lr', 'rl', 'ud', 'du'];
		console.log(oldAndNew);
		var isOppositeDirection = $.inArray(oldAndNew, ignoredDirectionChanges) != -1;
		console.log('Is opposite direction: ' + isOppositeDirection);


		if (!isPaused && !isOppositeDirection) {
			snake.direction = selectedDirection;
			updatePosition();
		}
	}
	else if (eventData.which === pause) {
		togglePause();
	}
	else {
		console.log('Unrecognised keydown: ' + eventData.which);
	}
}

function updatePosition() {
	var newHead = { x: snake.segments[0].x, y: snake.segments[0].y };

	switch (snake.direction) {
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

	if (snake.segments.length % 5 === 0) {
		console.log('speeding up');
		refreshInterval *= 0.75;
		stopGameClock();
		startGameClock();
	}
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

for (var i = 0; i < 7; i++) {
	addFood();
}

$('body').keydown(handleKeyDown);
// togglePause();