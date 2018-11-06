const path = require('path');

const CWD = process.cwd();

const fromCurrentFolder = path.relative.bind(null, CWD);

const SNAPSHOTS_FOLDER_NAME = '__snapshots__';
const SNAPSHOTS_FOLDER_PATH = fromCurrentFolder(SNAPSHOTS_FOLDER_NAME);

module.exports = {
  CWD,
  SNAPSHOTS_FOLDER_NAME,
  SNAPSHOTS_FOLDER_PATH
};
