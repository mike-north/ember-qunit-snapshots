const bParser = require('body-parser');
const express = require('express');
const router = require('./router');

const bodyParser = bParser.json();

/** @type {express.ErrorRequestHandler}*/
const logError = (err, _req, _res, next) => {
  // tslint:disable-next-line:no-console
  console.error(err.stack);
  next(err);
};

/**
 * Install router and other middlewares into ember app express server
 * @param {express.Application} app
 */
function installRouter(app) {
  app.use('/___SNAPSHOTS___', bodyParser, router, logError);
}

module.exports = {
  installRouter
};
