module.exports = {
  plugins: ['import', 'prettier'],
  extends: ['airbnb-base', 'eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  rules: {
    'prettier/prettier': 'error',
    'global-require': 'off',
    'consistent-return': 'off',
    'class-methods-use-this': 'off',

    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'no-restricted-syntax': 'off',
    'no-restricted-globals': 'off',
  },
};
