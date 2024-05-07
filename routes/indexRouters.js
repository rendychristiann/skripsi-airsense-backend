const express = require('express');
const router = express.Router();
const indexControllers = require('../controllers/indexControllers');

router.get('/', indexControllers.index);
router.get('/:id', indexControllers.show);
router.get('/allValue', indexControllers.allIndex);
router.post('/', indexControllers.create);
router.delete('/:id', indexControllers.deleteById);

module.exports = router;