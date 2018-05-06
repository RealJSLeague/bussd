const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

router.get('/', (req,res)=>{

Trip
        .find({})
        .then(trips =>  (trips ? (res.status(200).json(trips)) : res.status(404).send()))
        .catch(err => res.status(500).send('An internal server error has occured'));
});

router.get('/:id', (req, res) => {
  var id = req.params.id;
  Trip.find(
    { 'tripId': id },
    ' tripId routeId tripHeadSign',
    function(err, trips) {
      if (err) return handleError(err);
      //console.log(Trip.tripId)
      res.status(200).json(trips);
    }
  );
});

router.get('/:id/transform', (req, res) => {
  var id = req.params.id, trips = {};
  Trip.find(
    { 'tripId': id },
    ' tripId routeId tripHeadSign',
    function(err, Trip) {
      if (err) return handleError(err);
      for(var i=0; i < Trip.length; i++){
          trips[Trip[i].tripId] = 
                    {routeId : Trip[i].routeId,
                      tripHeadSign:Trip[i].tripHeadSign};
        
                  
      }
      
      res.status(200).json(trips);
      console.log('tripId in trips' +Trip[0].tripId);
      console.log('trips in trips' +trips[Trip[0].tripId].routeId );
       
    }
  );
});




module.exports = router;
