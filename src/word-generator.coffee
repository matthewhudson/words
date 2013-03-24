fs 		= require 'fs'
path  = require 'path'
lazy 	= require 'lazy'
_ 		= require 'underscore'

class exports.WordGenerator

  tree = {}
  alphabet = 'jqxzwkvfybhgmpudclotnraise'
  
  readWordsFile: (callback, finished) ->
    filepath = path.join __dirname, '../vendor/words.txt'
    readStream = fs.createReadStream filepath
    input = new lazy readStream 
    input.lines.forEach (line) ->
      callback '' + line

    readStream.on 'end', ->
      finished()


  histogramify: (word) ->
    histogram = {}
    ndx = 0

    while ndx < alphabet.length
      histogram[alphabet[ndx]] = 0
      ndx++
    ndx = 0

    while ndx < word.length
      histogram[word[ndx]]++
      ndx++
    histogram

  generateTree: (complete) ->
    console.log 'Generating anagram tree...'
    self = @

    # For each line in the file, this function is called
    @readWordsFile ( (word) ->
      hist = self.histogramify(word)
      curNode = tree
      ndx = 0

      while ndx < alphabet.length
        letter = alphabet[ndx]
        freq = hist[letter]
        curNode[freq] = {}  unless curNode[freq]?
        curNode = curNode[freq]
        ndx++
      curNode.words = []  unless curNode.words
      curNode.words.push word
    ), ->
      console.log 'Tree constructed. Ready for requests.'
      complete()


  getAnagrams: (lettersArray) ->
    hist = @histogramify(lettersArray)
    rootNode = tree
    frontier = [rootNode]
    ndx = 0

    while ndx < alphabet.length
      letter = alphabet[ndx]
      freq = hist[letter]
      newFrontier = []
      nodeNdx = 0

      while nodeNdx < frontier.length
        node = frontier[nodeNdx]
        i = 0

        while i <= freq
          newFrontier.push node[i]  unless not node[i]
          i++
        nodeNdx++
      frontier = newFrontier
      ndx++
    allAnagrams = []
    nodeNdx = 0

    while nodeNdx < frontier.length
      wordNdx = 0

      while wordNdx < frontier[nodeNdx].words.length
        allAnagrams.push frontier[nodeNdx].words[wordNdx]
        wordNdx++
      nodeNdx++
    
    _.sortBy allAnagrams, (anagram) ->
      -anagram.length
