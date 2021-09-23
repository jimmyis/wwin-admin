module.exports = {
  settings: {
    'import/resolver': {
      node: {
        paths: ['./src'],
      },
    },
    react: {
      version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
    }
  },
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },
  env: {
    es6: true,
    browser: true,
    jest: true,
  },
  extends: [
    // "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    // "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended" // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'no-console': ['warn', { allow: ['info', 'warn', 'error', 'debug'] }],
    'no-plusplus': 0,
    'prefer-destructuring': ['warn', { object: true, array: false }],
    'no-underscore-dangle': 0,
    'import/prefer-default-export': 0,
    '@typescript-eslint/no-unused-vars': 0,
    // Start temporary rules
    // These rules are here just to keep the lint error to 0 during the migration to the new rule set
    // They need to be removed and fixed as soon as possible
    // "@typescript-eslint/ban-ts-comment": [1, { "ts-ignore": false, "ts-nocheck": false }],
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    radix: 0,
    'import/no-extraneous-dependencies': 0,
    'jsx-a11y/media-has-caption': 0,
    // Exchange
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state', 'memo'] }],
    'react/require-default-props': 0,
    'no-nested-ternary': 0,
    'max-classes-per-file': 0,
    // End temporary rules
  },
}
