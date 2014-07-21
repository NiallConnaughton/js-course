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

grid[20][20] = 'O';

function render(grid) {
	var content = [];

	for (var rowIndex = 0; rowIndex < grid.length; rowIndex++) {
		var row = grid[rowIndex];
		for (var cellIndex = 0; cellIndex < row.length; cellIndex++) {
			var cell = row[cellIndex];
			// debugger;
			content.push('<div class="cell">' + cell + '</div>');
		}
	}

	var renderedContent = content.join('\n');
	$('#content').html(renderedContent);
}

render(grid);

// alert('done');

