const express = require('express');
const router = express.Router();
const StopTime = require('../models/StopTime');
const axios = require('axios');
const http = require('../../node_modules/axios/lib/adapters/http');
const moment = require('moment');
///not done

router.get('/:id', (req, res) => {
  var id = req.params.id;
  StopTime.find({ stopId: id }, ' tripId stopId arrivalTime departureTime', function(err, StopTime) {
    if (err) return handleError(err);

    res.status(200).json(StopTime);
  }).sort({ arrivalTime: 1 });
});

router.get('/:id/transform', async (req, res) => {
  let stopId = req.query.stopId;
  const config = { adapter: http, headers: { 'Access-Control-Allow-Origin': '*' } };

  let stopTimes = {},
    delay = {},
    timing = [];
  timing1 = [];
  timing2 = new Map();
  timing3 = [];
  timing4 = [];
  let timingMap = [];
  var tempTimingMap = new Map();
  await axios.get('http://localhost:8080/api/vehicle/', config).then(vehicleRes => {
    for (let j = 0; j < vehicleRes.data.length; j++) {
      if ((vehicleRes.data[j].tripStatus || vehicleRes.data[j].tripStatus) !== null) {
        delay[vehicleRes.data[j].tripId.replace(/MTS_/g, '')] = {
          scheduleDeviation: vehicleRes.data[j].tripStatus.scheduleDeviation
        };
      }
    }
  });
  function adjustTime(arrivalTime) {
    let rtsSplit = arrivalTime.split(':');
    rtsSplit = rtsSplit[0] + ':' + rtsSplit[1];

    return rtsSplit;
  }

  function getAmPm(arrivalTime) {
    let rtsSplit = arrivalTime.split(':');

    var hours = rtsSplit[0];

    var ampm = hours >= 12 ? 'pm' : 'am';

    return ampm;
  }
  await axios.get('http://localhost:8080/api/stop-times/' + stopId, config).then(async stoptimeRes => {
    for (let i = 0; i < stoptimeRes.data.length; i++) {
      let deviation = '';
      var arrivalTime = adjustTime(stoptimeRes.data[i].arrivalTime);
      //var arrivalTimeAmPm = getAmPm(stoptimeRes.data[i].arrivalTime);

      stopTimes[stoptimeRes.data[i].tripId] = { arrivalTime: arrivalTime };
      //  console.log('StopTimes: '+ stopTimes[stoptimeRes.data[i].tripId].arrivalTime);

      await axios.get('http://localhost:8080/api/trips/' + stoptimeRes.data[i].tripId, config).then(tripRes => {
        let timeNow = moment().format('HH:mm:ss');
        let scheduledArrivalTime = moment(stopTimes[tripRes.data[0].tripId].arrivalTime, 'HH:mm:ss');
        let futureTime = moment(scheduledArrivalTime, 'HH:mm:ss').isAfter(moment(timeNow, 'HH:mm:ss'));

        if (futureTime) {
          // console.log('routeId: '+tripRes.data[0].routeId+' -- To: '+ tripRes.data[0].tripHeadSign + ' -- Scheduled Arrival Time: '+ stopTimes[tripRes.data[0].tripId].arrivalTime + '-- TripId'+tripRes.data[0].tripId);

          if (tripRes.data[0].tripId in delay) {
            deviation = delay[tripRes.data[0].tripId].scheduleDeviation;

            if (deviation >= 60) {
              deviation = deviation / 60;
              deviation = deviation + ' mins late';
            } else if (deviation <= -60) {
              deviation = deviation / 60;
              deviation = deviation + ' mins early';
            } else {
              deviation = 'On Time';
            }
          } else {
            deviation = 'On Time';
          }

          timing1.push(
            tripRes.data[0].routeId +
              '--' +
              tripRes.data[0].tripHeadSign +
              '--' +
              stopTimes[tripRes.data[0].tripId].arrivalTime +
              //'--'+tripRes.data[0].tripId+
              '--' +
              (deviation === 'No Data' ? deviation : deviation)
          );
        }
      });
    }
  });
  console.log('timing:' + timing1);
  var counter = 0;
  timing1.forEach(element => {
    var strSPlit = element.split('--');
    var key = strSPlit[0] + '--' + strSPlit[1] + '--' + strSPlit[2];
    timing2.set(key, element);
  });
  var keyWithArrivalTime = Array.from(timing2.keys());
  var sortedTimingMap = new Map();
  for (var i = 0; i < keyWithArrivalTime.length; i++) {
    // timing3.push(timing2.get(keyWithArrivalTime[i]));
    var keySplit = keyWithArrivalTime[i].split('--');
    var newKeyValue = keySplit[0] + '--' + keySplit[1];
    if (!sortedTimingMap.has(newKeyValue)) {
      sortedTimingMap.set(newKeyValue, 0);
      timing3.push(timing2.get(keyWithArrivalTime[i]));
    } else {
      var counter = sortedTimingMap.get(newKeyValue);
      if (counter < 2) {
        sortedTimingMap.set(newKeyValue, counter + 1);
        timing3.push(timing2.get(keyWithArrivalTime[i]));
      }
    }
  }

  res.status(200).json(timing3);
});

module.exports = router;
