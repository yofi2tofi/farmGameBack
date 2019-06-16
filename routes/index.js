var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /:
 *    get:
 *      tags: [ "Index" ]
 *      description: This should return only message
 */
router.get('/', function(req, res, next) {
  res.json({ message: 'user' });
});

module.exports = router;
