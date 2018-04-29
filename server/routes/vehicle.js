const express = require('express');
const router = express.Router();
// const cache = require('express-redis-cache')({ client: require('redis').createClient(),expire: 20 });
var cache = require('express-redis-cache')({
  client: require('redis').createClient(process.env.REDIS_URL),
  expire: 20
});
const axios = require('axios');

router.get('/', cache.route(), function(req, res) {
  axios
    .get(process.env.REACT_APP_REDIS_API)
    .then(function(response) {
      res.status(200).json(response.data.data.list);
    })
    .catch(function(error) {
      console.log(error);
    });
});

module.exports = router;
