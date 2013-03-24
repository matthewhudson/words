var generator = new (require ('../')).WordGenerator

generator.generateTree(function () {
  var word = 'matthew';
  console.log ('Looking up anagrams for the name "' + word + '"...');
  var init = new Date();
  console.log (generator.getAnagrams(word));
  console.log ('Lookup of "' + word + '" took ' + (new Date() - init) + 'ms to complete');
});
