// @ts-check
const bParser = require('body-parser');
const express = require('express');
const router = require('../server/router');

const bodyParser = bParser.json();

/** @type {express.ErrorRequestHandler}*/
const logError = (err, _req, _res, next) => {
  // tslint:disable-next-line:no-console
  console.error(err.stack);
  next(err);
};

/**
 *
 * @param {express.Application} app
 */
function installRouter(app) {
  app.use('/___SNAPSHOTS___', bodyParser, router, logError);
}

/**
 * Used when app is in dev mode (`ember serve`).
 * Creates a new coverage map on every request.
 *
 * @param {express.Application} app
 */
const serverMiddleware = (app, _options) => {
  installRouter(app);
};

/**
 * Used when app is in ci mode (`ember test`).
 * Collects the coverage on each request and merges it into the coverage map.
 *
 * @param {express.Application} app
 */
const testMiddleware = (app, _options) => {
  installRouter(app);
};

module.exports = {
  serverMiddleware,
  testMiddleware
};
