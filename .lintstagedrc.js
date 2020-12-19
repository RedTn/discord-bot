module.exports = {
    '*.js': ['prettier --check', 'eslint'],
    'package.json': ['sort-package-json'],
};