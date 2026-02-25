import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface Histogram {
  [letter: string]: number;
}

interface TreeNode {
  [key: number]: TreeNode;
  words?: string[];
}

/**
 * A class for generating anagrams of words from comma-separated letters.
 * @example
 * const wordGenerator = new WordGenerator();
 * await wordGenerator.generateTree();
 * const anagrams = wordGenerator.getAnagrams(['t', 'e', 's', 't']);
 * console.log(anagrams);
 */
class WordGenerator {
  tree: TreeNode;
  alphabet: string;

  constructor() {
    this.tree = {};
    this.alphabet = "jqxzwkvfybhgmpudclotnraise";
  }

  /**
   * Reads words file and applies a callback on each line.
   */
  readWordsFile(
    callback: (line: string) => void,
    finished: () => void
  ): void {
    const filepath = path.join(__dirname, "../vendor/words.txt");
    const readStream = fs.createReadStream(filepath);
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });

    rl.on("line", (line: string) => {
      callback(line);
    });

    rl.on("close", () => {
      finished();
    });
  }

  /**
   * Creates a histogram from a given word based on the alphabet property.
   */
  histogramify(word: string | string[]): Histogram {
    const histogram: Histogram = {};
    let alphabetIndex = 0;

    while (alphabetIndex < this.alphabet.length) {
      histogram[this.alphabet[alphabetIndex]] = 0;
      alphabetIndex++;
    }

    let wordIndex = 0;
    while (wordIndex < word.length) {
      histogram[word[wordIndex]]++;
      wordIndex++;
    }

    return histogram;
  }

  /**
   * Generate a tree of words from given source file.
   */
  async generateTree(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.readWordsFile(
        (word: string) => {
          const histogram = this.histogramify(word);
          let currentNode: TreeNode = this.tree;
          let alphabetIndex = 0;

          while (alphabetIndex < this.alphabet.length) {
            const letter = this.alphabet[alphabetIndex];
            const frequency = histogram[letter];

            if (!currentNode[frequency]) {
              currentNode[frequency] = {};
            }
            currentNode = currentNode[frequency];
            alphabetIndex++;
          }

          if (!currentNode.words) {
            currentNode.words = [];
          }
          currentNode.words.push(word);
        },
        () => {
          resolve();
        }
      );
    });
  }

  /**
   * Get all possible anagrams for a given set of letters.
   */
  getAnagrams(lettersArray: string[]): string[] {
    const histogram = this.histogramify(lettersArray);
    const rootNode = this.tree;
    let frontier: TreeNode[] = [rootNode];
    let alphabetIndex = 0;

    while (alphabetIndex < this.alphabet.length) {
      const letter = this.alphabet[alphabetIndex];
      const frequency = histogram[letter];
      const newFrontier: TreeNode[] = [];
      let nodeIndex = 0;

      while (nodeIndex < frontier.length) {
        const currentNode = frontier[nodeIndex];
        let subNodeIndex = 0;

        while (subNodeIndex <= frequency) {
          if (currentNode[subNodeIndex]) {
            newFrontier.push(currentNode[subNodeIndex]);
          }
          subNodeIndex++;
        }
        nodeIndex++;
      }
      frontier = newFrontier;
      alphabetIndex++;
    }

    const allAnagrams: string[] = [];
    let nodeIndex = 0;

    while (nodeIndex < frontier.length) {
      const node = frontier[nodeIndex];
      if (node.words) {
        let wordIndex = 0;
        while (wordIndex < node.words.length) {
          allAnagrams.push(node.words[wordIndex]);
          wordIndex++;
        }
      }
      nodeIndex++;
    }

    return allAnagrams.sort((a, b) => b.length - a.length);
  }
}

export { WordGenerator };
