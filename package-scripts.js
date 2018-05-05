/* eslint-disable import/no-extraneous-dependencies */
const npsUtils = require('nps-utils');

const { series, concurrent, rimraf } = npsUtils;

module.exports = {
  scripts: {
    build: {
      description: 'delete the build directory and run all builds',
      default: series(
        rimraf('build'),
        concurrent.nps('build.sheets'),
        'pbcopy < build/index.js',
      ),
      sheets: {
        description: 'build sheets',
        script: 'rollup --config',
      },
    },
    mac: {
      script: 'babel-node mac/index.js',
    },
    prettier: {
      description: 'run prettier on files',
      script: 'prettier-eslint "**/*.js" --write --list-different',
    },
  },
};
