const { SNAPSHOTS_FOLDER_PATH, CWD } = require('../constants');
const express = require('express');
const fs = require('fs-extra');
const path = require('path');

/** @type {express.RequestHandler} */
const getSnapshots = (_request, response) => {
  if (!fs.existsSync(SNAPSHOTS_FOLDER_PATH)) {
    fs.mkdirsSync(SNAPSHOTS_FOLDER_PATH);
  }
  const dirContents = fs.readdirSync(SNAPSHOTS_FOLDER_PATH);
  const data = dirContents
    .filter(fileName => fileName.endsWith('.snapshot.js'))
    .map(fn => {
      const moduleName = path.join(CWD, SNAPSHOTS_FOLDER_PATH, fn);
      delete require.cache[moduleName];
      const mod = require(moduleName);
      const mod2 = JSON.parse(JSON.stringify(mod));
      return {
        name: fn.replace('.snapshot.js', ''),
        tests: mod2
      };
    });
  response.json(data);
};

module.exports = getSnapshots;
