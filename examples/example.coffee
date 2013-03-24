generator = new (require '../').WordGenerator

generator.generateTree () ->
  word = 'matthew'
  console.log 'Looking up anagrams for the name "' + word + '"...'
  init = new Date()
  console.log generator.getAnagrams word
  console.log 'Lookup of "' + word + '" took ' + (new Date() - init) + 'ms to complete'
