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

router.get('/transform', (req, res) => {
  let vehicleId = req.query.vehicleId.substr(4, req.query.vehicleId.length);
  let tripId = req.query.tripId.substr(4, req.query.tripId.length);
  let nextStop = req.query.nextStop.substr(4, req.query.nextStop.length);
  let scheduleDeviation = parseInt(req.query.scheduleDeviation);

  /* axios
    .get('http://localhost:8080/api/stops/' + nextStop)
    .then(response => {
      console.log(response.data);
      res.status(200).json(response.data);
    })
    .catch(err => {
      console.log(err);
    }); */

  axios
    .all([
      axios.get('http://localhost:8080/api/stops/' + nextStop),
      axios.get('http://localhost:8080/api/trips/' + tripId),
      axios.get('http://localhost:8080/api/stop-times/' + nextStop)
    ])
    .then(
      axios.spread((stopRes, tripRes, stopTimesRes) => {
        let tripInfo = {
          nextStopName: stopRes.data[0].stopName,
          routeId: tripRes.data[0].routeId,
          tripHeadSign: tripRes.data[0].tripHeadSign,
          relevantStopTime: null
        };

        stopTimesRes.data.forEach(stopTime => {
          if (tripId == stopTime.tripId) {
            tripInfo.relevantStopTime = stopTime.arrivalTime;
            //console.log(tripInfo.relevantStopTime);

            let rtsSplit = tripInfo.relevantStopTime.split(':');
            let rtsSeconds = +rtsSplit[0] * 60 * 60 + rtsSplit[1] * 60;
            //console.log('Converted: ' + rtsSeconds);
            rtsSeconds = parseInt(rtsSeconds);
            //console.log('Parsed: ' + rtsSeconds);
            //let adjustedStopTime = scheduleDeviation + rtsSeconds;
            let adjustedStopTime = rtsSeconds;
            //console.log('Adjusted: ' + adjustedStopTime);

            let adjustedHours = Math.floor(adjustedStopTime / 3600);
            adjustedStopTime %= 3600;
            let adjustedMinutes = Math.floor(adjustedStopTime / 60);

            if (adjustedHours > 12) {
              adjustedHours = adjustedHours - 12;
            }

            if (adjustedMinutes < 10) {
              adjustedMinutes = '0' + adjustedMinutes;
            }

            tripInfo.relevantStopTime = adjustedHours + ':' + adjustedMinutes;
            //console.log(tripInfo.relevantStopTime);
          }
        });
        res.status(200).json(tripInfo);
      })
    )
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
