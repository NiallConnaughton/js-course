function myMax(numbers) {
	var max = numbers[0];

	for (var i = 1; i < numbers.length; i++) {
		if (numbers[i] > max)
			max = numbers[i];
	};

	return max;
}

function vowelCount(text) {
	var count = 0;
	var vowels = ['a', 'e', 'i', 'o', 'u'];

	for (var i = 0; i < text.length; i++) {
		if (vowels.indexOf(text[i].toLowerCase()) >= 0) {
			count++;
		}
	}

	return count;
}

function reverseText(text) {
	var reversedText = '';

	for (var i = text.length - 1; i >= 0; i--) {
		reversedText += text[i];
	};

	return reversedText;
}