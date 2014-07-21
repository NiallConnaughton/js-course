// alert('initialising');

// debugger;

var grid = [];
for (var i = 0; i < 40; i++) {
	var row = [];
	for (var j = 0; j < 40; j++) {
		row.push('&nbsp;');
	}
	grid.push(row);
}

// grid[20][20] = 'O';

function render(grid) {
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

var directions = ['l', 'u', 'r', 'd'];
var snake = {
	direction: 2, // right
	position: [20,20]
}

grid[snake.position[0]][snake.position[1]] = 'O';

render(grid);

var left = 37, right = 39;
$('body').keydown(function(eventData) {
	switch (eventData.which){
		case left:
			snake.direction = (snake.direction - 1 + 4) % 4;
			break;
		case right:
			snake.direction = (snake.direction + 1) % 4;
			break;
	}
	console.log(directions[snake.direction]);
});

// alert('done');

