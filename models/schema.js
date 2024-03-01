const mongoose = require("mongoose");
const moment = require("moment-timezone");

const dbSchema = new mongoose.Schema({
  PM25: { type: Number, required: true },
  SNR: { type: Number, required: true},
  RSSI: { type:Number, required: true},
  timestamp: { type: String, required: true},
  dateValue: { type: Date, required: true},
});

// dbSchema.set('timestamps', {
//     createdAt: "crdAt", 
//     updatedAt: "updAt"
// });

dbSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('airIndex', dbSchema);
