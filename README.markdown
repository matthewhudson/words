# [WORDS](https://hudson.dev/words/)

> The TypeScript module `words` generates a list of words from a word, or a few letters. It's helpful for providing hints while playing games like Letterpress, Words with Friends, and Scrabble.

[![codecov](https://codecov.io/github/matthewhudson/words/branch/main/graph/badge.svg?token=oxazfuInJ9)](https://codecov.io/github/matthewhudson/words)

### Web Application Demo

<a href="https://hudson.dev/words/"><img src="http://media.tumblr.com/tumblr_mckych52sB1qzs7v7.png" /></a>

## Requirements

- Node.js 22+
- pnpm

## Installation

```bash
pnpm add words
```

## Usage

```typescript
import { WordGenerator } from "words";

const wg = new WordGenerator();
await wg.generateTree();
const anagrams = wg.getAnagrams(["h", "e", "l", "l", "o"]);
console.log(anagrams);
```

A demo version is available online:

```bash
curl https://httpip.es/api/words?letters=h,e,l,l,o
```

## Development

```bash
pnpm install        # Install dependencies
pnpm type-check     # Run TypeScript type checking
pnpm build          # Compile TypeScript to dist/
pnpm test           # Run tests
pnpm dev            # Watch mode for TypeScript compilation
```

## Suggestions

All comments in how to improve this library are very welcome. Feel free post suggestions to the Issue tracker, or even better, fork the repository to implement your own ideas and submit a pull request.

## License

Unless attributed otherwise, everything is under the MIT License (see LICENSE for more info).
