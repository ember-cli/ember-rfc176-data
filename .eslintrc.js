module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  plugins: ['prettier', 'node'],
  parserOptions: {
    ecmaVersion: 2017,
  },
  env: {
    node: true,
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true, trailingComma: 'es5' }],
  },
  overrides: [
    {
      files: ['scripts/*.js'],
      rules: {
        'no-console': 'off',

        // prevent fallback to node 4 only support, this package only distributes *.json
        // node version isn't super important...
        'node/no-unsupported-features': 'off',
      }
    },
  ]
};
