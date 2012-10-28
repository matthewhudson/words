var fs = require('fs');
var express = require('express');
var _ = require('underscore');
var app = express();
var port = process.env.PORT || 3000;

// Handle uncaughtException and other errors
var errorHandler = function (err, request, response, next) {
	console.log(err);
	response.send(404);
	next();
};

// Cross-Origin Resource Sharing middleware
var allowCrossDomain = function (request, response, next) {
	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Methods', 'GET');
	next();
}

app.configure(function () {
	app.use(allowCrossDomain);
	app.use(errorHandler);
});

function testWord(word, allowedLetters) {
	var wordLetters = word.split(''),
		isLegit = false,
		wordLetterOccurrences = [],
		allowedLetterOccurrences = [];

	// Return if word has more letters than there are allowed letters
	if (_.size(wordLetters) > _.size(allowedLetters)) {
		return false;
	}

	// Returns the values from wordLetters that are not present in allowedLetters
	var illegalLetters = _.difference(wordLetters, allowedLetters);

	if (_.size(illegalLetters)) {
		return false;
	} else {

		// Count each letter in wordLetters and allowedLetters
		wordLetterOccurrences = _.groupBy(wordLetters, function (letter) {
			return letter;
		});
		allowedLetterOccurrences = _.groupBy(allowedLetters, function (letter) {
			return letter;
		});

		// If returns true if all 
		// wordLetters letter count <= allowedLetters letter count
		isLegit = _.all(wordLetterOccurrences, function (list, key) {
			if (_.size(list) <= _.size(allowedLetterOccurrences[key])) {
				return true;
			}
		});

		// Final check, if isLegit then this is a word
		if (isLegit) {
			return true;
		}
	}

	return false;
}

function possibleWords(allowedLetters, cb) {
	var remaining = '';
	var input = fs.createReadStream('words.txt');
	var words = [];

	input.on('data', function (data) {
		remaining += data;
		var index = remaining.indexOf('\n');
		var last = 0;

		while (index > -1) {
			var line = remaining.substring(last, index);
			last = index + 1;

			if (testWord(line, allowedLetters)) {
				words.push(line);
			}
			index = remaining.indexOf('\n', last);
		}

		remaining = remaining.substring(last);
	});

	input.on('end', function () {
		if (remaining.length > 0) {
			if (testWord(remaining, allowedLetters)) {
				words.push(remaining);
			}
		} else {
			cb(words);
		}
	});
}

app.get('/', function (request, response) {
	var letters = [];

	if (!_.has(request.query, 'letters')) {
		response.send(404);
		return;
	}

	letters = request.query.letters.toLowerCase().split(',');

	possibleWords(letters, function (words) {
		words.sort(function(a,b){return b.length-a.length})
		response.json(words);
	});
});

app.listen(port, function () {
	console.log("Word Generator: Listening on " + port);
});