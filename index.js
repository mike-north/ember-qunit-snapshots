'use strict';
const path = require('path');
const fs = require('fs');
const { installRouter } = require('./lib/attach-middleware');

let fileLookup = null;

function createSnapshotFolder(rootPath) {
  const snapDir = path.join(rootPath, '__snapshots__');
  if (!fs.existsSync(snapDir)) {
    fs.mkdirSync(snapDir);
  }
}

module.exports = {
  name: require('./package').name,
  included(_appOrAddon) {
    this._super.included.apply(this, arguments);
    const projectRoot = this.project.root;
    createSnapshotFolder(projectRoot);
    fileLookup = this.fileLookup = {};
  },

  treeForAddonTestSupport(tree) {
    const Funnel = require('broccoli-funnel');

    let namespacedTree = new Funnel(tree, {
      srcDir: '/',
      destDir: `/${this.moduleName()}`,
      annotation: `Addon#treeForTestSupport (${this.name})`
    });

    return this.preprocessJs(namespacedTree, '/', this.name, {
      registry: this.registry
    });
  },

  serverMiddleware: function(startOptions) {
    installRouter(startOptions.app, {
      configPath: this.project.configPath(),
      root: this.project.root,
      fileLookup: fileLookup
    });
  },

  testemMiddleware: function(app) {
    this.serverMiddleware({ app });
  }
};
