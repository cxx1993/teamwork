// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential', 'airbnb-base'],
  // required to lint *.vue files
  plugins: ['vue'],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js',
      },
    },
  },
  // add your custom rules here
  rules: {
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    // don't require .vue extension when importing
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        vue: 'never',
      },
    ],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state', // for vuex state
          'acc', // for reduce accumulators
          'e', // for e.returnvalue
        ],
      },
    ],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: ['test/unit/index.js'],
      },
    ],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'comma-dangle': [2, "never"],
    'filenames/match-regex': [0],
    'no-reserved-keys': [0],
    'no-alert': [1],
    semi: [2, 'never'],
    'no-console': [1],
    'prefer-const': [1],
    'eol-last': [1],
    'object-shorthand': [1],
    'func-names': [0],
    'no-shadow': [1],
    'arrow-body-style': [0],
    'comma-dangle': [1],
    'space-before-function-paren': [1],
    'prefer-template': [1],
    'no-new': [0],
    'consistent-return': [1],
    'quote-props': [1],
    'array-bracket-spacing': [1],
    'no-unused-vars': [1, { argsIgnorePattern: '^h|context$' }],
    'computed-property-spacing': [1],
    'max-len': [1, 200],
    'global-require': [0],
    'arrow-parens': [0],
    'linebreak-style': [0],
    'no-plusplus': [0],
    'no-underscore-dangle': [0],
    'new-cap': [1],
    'no-restricted-syntax': [0],
    'class-methods-use-this': [0],
    'import/no-unresolved': [0],
    'import/prefer-default-export': [0],
    'import/no-dynamic-require': [0],
    'import/imports-first': [0],
    'import/newline-after-import': [1],
    'no-return-assign': [0],
    'no-param-reassign': [2, { props: false }],
  },
}
