import fs from 'fs'
import path from 'path'
import readline from 'readline'

/**
 * A class for generating anagrams of words from comma-separated letters.
 * @example
 * // Create a new instance of WordGenerator
 * const wordGenerator = new WordGenerator();
 * // Generate the anagram tree
 * await wordGenerator.generateTree();
 * // Get the anagrams for a set of letters
 * const lettersArray = ['t', 'e', 's', 't'];
 * const anagrams = wordGenerator.getAnagrams(lettersArray);
 * console.log(anagrams);
 */
class WordGenerator {
  /**
   * Create a new instance of WordGenerator.
   */
  constructor () {
    this.tree = {}
    this.alphabet = 'jqxzwkvfybhgmpudclotnraise'
  }

  /**
   * Reads words file and applies a callback on each line
   * @param {function} callback - Function to be called on each line
   * @param {function} finished - Function to be called when file reading is finished
   */
  readWordsFile (callback, finished) {
    const filepath = path.join(__dirname, '../vendor/words.txt')
    const readStream = fs.createReadStream(filepath)
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity
    })

    rl.on('line', (line) => {
      callback(line)
    })

    rl.on('close', () => {
      finished()
    })
  }

  /**
   * Creates a histogram from a given word based on the alphabet property
   * @param {string} word - The word to create a histogram from
   * @returns {object} histogram - The created histogram with alphabet characters as keys and their frequency as values
   */
  histogramify (word) {
    const histogram = {}
    let alphabetIndex = 0

    // Initialize histogram with alphabet characters and set their frequency to 0
    while (alphabetIndex < this.alphabet.length) {
      histogram[this.alphabet[alphabetIndex]] = 0
      alphabetIndex++
    }

    let wordIndex = 0
    // Iterate through the word and update the frequency of each character in the histogram
    while (wordIndex < word.length) {
      histogram[word[wordIndex]]++
      wordIndex++
    }

    return histogram
  }

  /**
   * Generate a tree of words from given source file.
   * @async
   * @returns {Promise<void>} Promise that resolves when the tree is generated.
   */
  async generateTree () {
    return new Promise((resolve, reject) => {
      this.readWordsFile(
        (word) => {
          const histogram = this.histogramify(word)
          let currentNode = this.tree
          let alphabetIndex = 0

          // Iterate through the alphabet and create tree nodes based on character frequencies
          while (alphabetIndex < this.alphabet.length) {
            const letter = this.alphabet[alphabetIndex]
            const frequency = histogram[letter]

            // Create a new node for the frequency if it doesn't exist
            if (!currentNode[frequency]) {
              currentNode[frequency] = {}
            }
            currentNode = currentNode[frequency]
            alphabetIndex++
          }

          // Add the word to the words array in the current node
          if (!currentNode.words) {
            currentNode.words = []
          }
          currentNode.words.push(word)
        },
        () => {
          resolve()
        }
      )
    })
  }

  /**
   * Get all possible anagrams for a given set of letters
   * @param {string[]} lettersArray - Array of letters
   * @returns {string[]} allAnagrams - Sorted array of anagrams in descending order of length
   */
  getAnagrams (lettersArray) {
    const histogram = this.histogramify(lettersArray)
    const rootNode = this.tree
    let frontier = [rootNode]
    let alphabetIndex = 0

    // Iterate through the alphabet and traverse the tree based on character frequencies
    while (alphabetIndex < this.alphabet.length) {
      const letter = this.alphabet[alphabetIndex]
      const frequency = histogram[letter]
      const newFrontier = []
      let nodeIndex = 0

      // Traverse the frontier nodes to build new frontier nodes
      while (nodeIndex < frontier.length) {
        const currentNode = frontier[nodeIndex]
        let subNodeIndex = 0

        // Add nodes from the current frontier to the new frontier based on their frequency
        while (subNodeIndex <= frequency) {
          if (currentNode[subNodeIndex]) {
            newFrontier.push(currentNode[subNodeIndex])
          }
          subNodeIndex++
        }
        nodeIndex++
      }
      frontier = newFrontier
      alphabetIndex++
    }

    const allAnagrams = []
    let nodeIndex = 0

    // Iterate through the frontier nodes and add their words to the allAnagrams array
    while (nodeIndex < frontier.length) {
      let wordIndex = 0

      while (wordIndex < frontier[nodeIndex].words.length) {
        allAnagrams.push(frontier[nodeIndex].words[wordIndex])
        wordIndex++
      }
      nodeIndex++
    }

    // Sort the anagrams in descending order of length
    return allAnagrams.sort((a, b) => b.length - a.length)
  }
}

export { WordGenerator }
