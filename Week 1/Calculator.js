function add(a, b) {
	return a + b;
}

function subtract(a, b) {
	return a - b;
}

function divide(a, b) {
	return a / b;
}

function multiply(a, b) {
	return a * b;
}

function addDigit(d) {
	currentNumberText += d.toString();
	currentNumber = Number(currentNumberText);

	document.getElementById("resultBox").value = currentNumber;
	console.log(currentNumber);
}

function showResult(result) {
	console.log("Calculation result " + result);
}

function operatorSelected(o) {
	firstOperand = currentNumber;
	currentNumberText = "";
	currentNumber = 0;
	operator = o;
}

function equalsSelected() {
	var result;

	switch (operator)
	{
		case '+':
			result = add(firstOperand, currentNumber);
			break;

		case '-':
			result = subtract(firstOperand, currentNumber);
			break;

		case '*':
			result = multiply(firstOperand, currentNumber);
			break;

		case '/':
			result = divide(firstOperand, currentNumber);
			break;
	}

	currentNumber = 0;
	currentNumberText = "";

	showResult(result);
}

currentNumberText = "";