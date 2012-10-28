var fs = require('fs');
var express = require('express');
var _ = require('underscore');
var lazy = require('lazy');
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

var readWordsFile = function(callback, finished){
	var readStream = fs.createReadStream('words.txt');
	var input = new lazy(readStream);
	input.lines.forEach(function(line){
		callback(""+line);
	});
	readStream.on('end', function(){
		finished();
	});
}

var histogramify = function(word){
	var histogram = {};
	for(var ndx=0; ndx<alphabet.length; ndx++)
		histogram[alphabet[ndx]] = 0;
	for(var ndx=0; ndx<word.length; ndx++)
		histogram[word[ndx]]++;
	return histogram;
}

var tree = {};
var alphabet = "abcdefghijklmnopqrstuvwxyz";
var generateTree = function(complete) {
	console.log("Generating anagram tree...");
	readWordsFile(
		//for each line in the file, this function is called
		function(word){
			var hist = histogramify(word);
			var curNode = tree;
			for(var ndx=0; ndx<alphabet.length; ndx++){
				var letter = alphabet[ndx];
				var freq = hist[letter];
				if(!curNode[freq])
					curNode[freq] = {};
				curNode = curNode[freq];
			}
			if(!curNode.words) curNode.words = [];
			curNode.words.push(word);
		},
		function(){
			console.log("Tree constructed. Ready for requests.");
			complete();
		}
	);
}

var getAnagrams = function(lettersArray){
	var hist = histogramify(lettersArray);
	var rootNode = tree;
	var frontier = [rootNode];
	for(var ndx=0; ndx<alphabet.length; ndx++){
		var letter = alphabet[ndx];
		var freq = hist[letter];
		var newFrontier = [];
		for(var nodeNdx=0; nodeNdx<frontier.length; nodeNdx++){
			var node = frontier[nodeNdx];
			for(var i=0; i<=freq; i++)
				if(!!node[i])
					newFrontier.push(node[i]);
		}
		frontier = newFrontier;
	}
	var allAnagrams = [];
	for(var nodeNdx=0; nodeNdx<frontier.length; nodeNdx++){
		for(var wordNdx=0; wordNdx<frontier[nodeNdx].words.length; wordNdx++)
			allAnagrams.push(frontier[nodeNdx].words[wordNdx]);
	}
	return allAnagrams;
}

var indexHandler = function (request, response) {

	if (!_.has(request.query, 'letters')) {
		response.send(404);
		return;
	}
	
	var word = request.query.letters.toLowerCase().split(',').join("");
	
	console.log("Looking up anagrams of '"+word+"'");
	var init = new Date();

	var anagrams = getAnagrams(word);

	console.log("Lookup for '"+word+"' took "+(new Date() - init)+"ms to complete");

	response.json(_.sortBy(anagrams, function(anagram){return anagram.length}));
};

app.get('/', indexHandler);

//generate tree (and when complete, start listening for requests)
generateTree(function(){
	app.listen(port, function () {
		console.log("Word Generator: Listening on " + port);
	});
});
