const airIndex = require("../models/schema");
const moment = require("moment-timezone");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

function sendWhatsApp(message) {
  client.messages
    .create({
      from: process.env.WHATSAPP_FROM,
      body: message,
      to: process.env.WHATSAPP_TO
    })
    .then(result => console.log(`Pesan WhatsApp terkirim dengan SID: ${result.sid}`))
    .catch(err => console.error(`Error: ${err.message}`))
    .done();
}

const index = (request, response) => {
  const today = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
  airIndex
    .find({ dateValue: today })
    .sort({ timestamp: 1 })
    .then((value) => {
      return response.json(value);
    });
};

const allIndex = (request, response) => {
  airIndex
    .find({})
    .then((allValue) => {
      return response.json(allValue);
    })
    .catch((error) => {
      console.error('Error fetching data: ', error);
      response.status(500).json({error: 'Failed to fetch data'});
    });
};

const show = (request, response, next) => {
  airIndex
    .findById(request.params.id)
    .then((indexData) => {
      if (indexData) {
        return response.json(indexData);
      } else {
        return response.status(404).end();
      }
    })
    .catch((error) => next(error));
};

const info = (request, response) => {
  const date = new Date();
  airIndex.count().then((count) => {
    return response.send(
      `<h2>Air Index has info for ${count}</h2><br/><p>${date}</p>`
    );
  });
};

const deleteById = (request, response, next) => {
  console.log(request.params);
  airIndex
    .findByIdAndDelete(request.params.id)
    .then(() => {
      return response.status(204).end();
    })
    .catch((error) => next(error));
};

const create = (request, response, next) => {
  const body = request.body;
  const times = moment().tz("Asia/Jakarta").format("HH:mm:ss");
  const dates = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
  const indexData = new airIndex({
    PM25: body.PM25,
    SNR: body.SNR,
    RSSI: body.RSSI,
    timestamp: times,
    dateValue: dates,
  });

  indexData
    .save()
    .then((result) => {
      console.log("Add new value successfull");
      const threshold = 150;
      if (body.PM25 > threshold) {
        sendWhatsApp(`Indeks PM2.5 saat ini: ${result.PM25}. Udara tidak sehat, gunakan masker ketika ke luar ruangan!`);
      }
      return response.status(201).json(result);
    })
    .catch((error) => next(error));
};


module.exports = {
  create,
  index,
  show,
  info,
  deleteById,
  allIndex
};
