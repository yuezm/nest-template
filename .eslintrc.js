module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports', 'security'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // '@typescript-eslint/interface-name-prefix': [
    //   'warn',
    //   {
    //     prefixWithI: 'always',
    //   },
    // ],
    // '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'unused-imports/no-unused-imports-ts': 2,
    'unused-imports/no-unused-vars-ts': 1,
    'security/detect-object-injection': 'off',
  },
};
