const e = require('express');
const snapShot = require('snap-shot-core');
const { OPTIONS_FROM_ENV } = require('../env');

/** @type {e.RequestHandler} */
const updateSnapshot = (request, response) => {
  const {
    body,
    params: { modulename = 'default-module', testname, snapname }
  } = request;
  let errored = false;

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
    opts: OPTIONS_FROM_ENV
  });
  if (!errored) {
    response.status(201);
    response.send();
  }
};

module.exports = updateSnapshot;
