module.exports = {
  extends: ['airbnb-base', 'prettier'],
  parser: 'babel-eslint',
  plugins: ['prettier', 'googleappsscript'],
  env: {
    'googleappsscript/googleappsscript': true,
  },
  rules: {
    'import/prefer-default-export': 'off',
    'no-unused-vars': ['error', { varsIgnorePattern: 'test' }],
  },
};
