// @ts-check
const Router = require('express').Router;
const router = Router();
const snapShot = require('snap-shot-core');
const fs = require('fs-extra');
const path = require('path');

const SNAPSHOTS_FOLDER = '__snapshots__';

const cwd = process.cwd();
const fromCurrentFolder = path.relative.bind(null, cwd);
const snapshotsFolder = fromCurrentFolder(SNAPSHOTS_FOLDER);

router.get('/snapshots', (_request, response) => {
  if (!fs.existsSync(snapshotsFolder)) {
    fs.mkdirsSync(snapshotsFolder);
  }
  const dirContents = fs.readdirSync(snapshotsFolder);
  const data = dirContents
    .filter(fileName => fileName.endsWith('.snapshot.js'))
    .map(fn => {
      const moduleName = path.join(cwd, snapshotsFolder, fn);
      delete require.cache[moduleName];
      const mod = require(moduleName);
      const mod2 = JSON.parse(JSON.stringify(mod));
      return {
        name: fn.replace('.snapshot.js', ''),
        tests: mod2
      };
    });
  response.json(data);
});

router.put('/snapshot/:modulename/:testname/:snapname', (request, response) => {
  const {
    body,
    params: { modulename = 'default-module', testname, snapname }
  } = request;
  let errored = false;

  const opts = {
    show: Boolean(process.env.SNAPSHOT_SHOW),
    dryRun: Boolean(process.env.SNAPSHOT_DRY),
    update: Boolean(process.env.SNAPSHOT_UPDATE),
    ci:
      Boolean(process.env.SNAPSHOT_CI) ||
      (typeof process.env.SNAPSHOT_CI === 'undefined' &&
        Boolean(process.env.EMBER_TRY_SCENARIO))
  };

  const out = snapShot.core({
    what: body.snapshot,
    file: modulename,
    raiser(err) {
      const { expected, value } = err;
      response.status(400);
      response.send({ expected, value });
    },
    exactSpecName: `${testname}-${snapname}`,
    opts
  });
  if (!errored) {
    response.status(201);
    response.send();
  }
});

module.exports = router;
