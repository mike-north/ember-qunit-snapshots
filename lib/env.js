const snapShot = require('snap-shot-core');

/** @type {snapShot.SnapEnvOptions} */
const OPTIONS_FROM_ENV = {
  show: process.env.SNAPSHOT_SHOW === 'true',
  dryRun: process.env.SNAPSHOT_DRY === 'true',
  update: process.env.SNAPSHOT_UPDATE === 'true',
  ci: process.env.SNAPSHOT_CI === 'true' || process.env.EMBER_TRY_SCENARIO
};

module.exports = {
  OPTIONS_FROM_ENV
};
