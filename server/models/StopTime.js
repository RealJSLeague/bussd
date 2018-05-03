const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StopTimeSchema = new Schema({
  tripId: { type: Number, required: true },
  stopId: { type: Number, required: true },
  arrivalTime: { type: String, required: true },
  departureTime: { type: String, required: false }
});

module.exports = mongoose.model('StopTime', StopTimeSchema);
