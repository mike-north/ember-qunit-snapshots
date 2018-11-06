const Router = require('express').Router;
const router = Router();
const getSnapshots = require('./routes/get-snapshots');
const updateSnapshot = require('./routes/update-snapshot');

router.get('/snapshots', getSnapshots);
router.put('/snapshot/:modulename/:testname/:snapname', updateSnapshot);

module.exports = router;
