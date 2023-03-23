export default {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(.+).js$': '$1'
  },
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
}
