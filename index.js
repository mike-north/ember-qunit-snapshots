'use strict';
const path = require('path');
const fs = require('fs');
const attachMiddleware = require('./lib/attach-middleware');

let fileLookup = null;

function createSnapshotFolder(rootPath) {
  const snapDir = path.join(rootPath, '__snapshots__');
  if (!fs.existsSync(snapDir)) {
    fs.mkdirSync(snapDir);
  }
}

module.exports = {
  name: require('./package').name,
  included(appOrAddon) {
    this._super.included.apply(this, arguments);
    appOrAddon.import('node_modules/json-stable-stringify/index.js', {
      using: [{ transformation: 'cjs', as: 'json-stable-stringify' }]
    });
    const projectRoot = this.project.root;
    createSnapshotFolder(projectRoot);
    fileLookup = this.fileLookup = {};
  },
  /**
   * If coverage is enabled attach coverage middleware to the express server run by ember-cli
   * @param {Object} startOptions - Express server start options
   */
  serverMiddleware: function(startOptions) {
    attachMiddleware.serverMiddleware(startOptions.app, {
      configPath: this.project.configPath(),
      root: this.project.root,
      fileLookup: fileLookup
    });
  },
  testemMiddleware: function(app) {
    const config = {
      configPath: this.project.configPath(),
      root: this.project.root,
      fileLookup: fileLookup
    };
    // if we're running `ember test --server` use the `serverMiddleware`.
    if (process.argv.includes('--server') || process.argv.includes('-s')) {
      return this.serverMiddleware({ app }, config);
    }
    attachMiddleware.testMiddleware(app, config);
  }
};
