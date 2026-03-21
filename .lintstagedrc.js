module.exports = {
    '*.ts': ['prettier --write', 'eslint --no-warn-ignored --fix'],
    'package.json': ['sort-package-json'],
};
