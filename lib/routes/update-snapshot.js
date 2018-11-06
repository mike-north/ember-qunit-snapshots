const e = require('express');
const snapShot = require('snap-shot-core');

/** @type {e.RequestHandler} */
const updateSnapshot = (request, response) => {
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
    /**
     *
     * @param {any} err
     */
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
};

module.exports = updateSnapshot;
