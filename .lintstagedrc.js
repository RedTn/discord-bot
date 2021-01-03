module.exports = {
    '*.ts': ['prettier --write', 'eslint --fix'],
    'package.json': ['sort-package-json'],
};
