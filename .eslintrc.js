module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    "parserOptions": {
        "ecmaVersion": 2021,
        "sourceType": "module"
      },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
  };