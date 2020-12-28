module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2021: true,
    },
    settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'airbnb-base',
        'prettier',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'no-console': 'off',
        'import/prefer-default-export': 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-empty-function': 'off',
    },
};
