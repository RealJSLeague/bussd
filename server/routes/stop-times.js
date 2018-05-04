const express = require('express');
const router = express.Router();
const StopTime = require('../models/StopTime');
///not done

 router.get('/:id', (req, res) => {
  var id = req.params.id;
  StopTime.find(
    { 'stopId': id },
    ' tripId stopId arrivalTime departureTime',
    function(err, StopTime) {
      if (err) return handleError(err);
      console.log(StopTime[0].stopId);
      res.status(200).json(StopTime);
    }
  );

  router.get('/:id/transform', (req, res) => {
    var id = req.params.id;
    StopTime.find(
      { 'stopId': id },
      ' tripId stopId arrivalTime departureTime',
      function(err, StopTime) {
        if (err) return handleError(err);
        
        res.status(200).json(StopTime);
      }
    );
   
  });

});

module.exports = router;