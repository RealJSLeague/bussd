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
      console.log(StopTime.stopId);
      res.status(200).json(StopTime);
    }
  );

//   StopTime.find({ stopId: id }, 'tripId stopId arrivalTime departureTime', function(err, StopTime) {
//     if (err) return handleError(err);
//     console.log(StopTime.stopId);
//     res.status(200).json(StopTime);
//   });
// }); 

});

module.exports = router;