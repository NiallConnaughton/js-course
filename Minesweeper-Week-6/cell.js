function Cell(x, y) {
	this.x = x;
	this.y = y;

	this.isBomb = false;
	this.isFlagged = false;
	this.neighbourBombs = 0;
}

function addNeighbourBomb() {
	this.neighbourBombs++;
}