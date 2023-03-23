import { WordGenerator } from '.'

describe('WordGenerator', () => {
  let wordGenerator

  beforeEach(async () => {
    wordGenerator = new WordGenerator()
    await wordGenerator.generateTree()
  })

  test('histogramify', () => {
    const histogram = wordGenerator.histogramify('test')
    expect(histogram).toMatchObject({
      j: 0,
      q: 0,
      x: 0,
      z: 0,
      w: 0,
      k: 0,
      v: 0,
      f: 0,
      y: 0,
      b: 0,
      h: 0,
      g: 0,
      m: 0,
      p: 0,
      u: 0,
      d: 0,
      c: 0,
      l: 0,
      o: 0,
      t: 2,
      n: 0,
      r: 0,
      a: 0,
      i: 0,
      s: 1,
      e: 1
    })
  })

  test('getAnagrams', async () => {
    const anagrams = wordGenerator.getAnagrams(['t', 'e', 's', 't'])
    expect(anagrams.sort()).toEqual(
      ['test', 'sett', 'stet', 'tets', 'set', 'tet', 'es', 'et'].sort()
    )
  })
})
