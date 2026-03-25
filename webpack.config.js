const Path = require('path');
const { JavascriptWebpackConfig, CssWebpackConfig } = require('@silverstripe/webpack-config');

const PATHS = {
  ROOT: Path.resolve(),
  SRC: Path.resolve('client/src'),
  DIST: Path.resolve('client/dist'),
};

const config = [
  new JavascriptWebpackConfig('js', PATHS, 'atwx/silverstripe-cms-popup')
    .setEntry({
      bundle: `${PATHS.SRC}/bundles/bundle.js`,
    })
    .getConfig(),
  new CssWebpackConfig('css', PATHS, 'css/[name].css')
    .setEntry({
      'cms-popup': `${PATHS.SRC}/scss/cms-popup.scss`,
    })
    .getConfig(),
];

module.exports = config;
