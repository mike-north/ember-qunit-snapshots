const snapShot = require('snap-shot-core');
const ci = require('ci-info');

/** @type {snapShot.SnapEnvOptions} */
const OPTIONS_FROM_ENV = {
  show: process.env.SNAPSHOT_SHOW === 'true',
  dryRun: process.env.SNAPSHOT_DRY === 'true',
  update: process.env.SNAPSHOT_UPDATE === 'true',
  ci: process.env.SNAPSHOT_CI === 'true' || ci.isCI
};

module.exports = {
  OPTIONS_FROM_ENV
};
