const express = require('express');
const cors = require('cors');

//importing routes
const prescription = require('./routes/api/prescription');
const patient = require('./routes/api/patient');
const doctor = require('./routes/api/doctor');
const monitoring = require('./routes/api/monitoring');
const report = require('./routes/api/report');
const image = require('./routes/api/image');
const ping = require('./routes/api/ping');

// s3.upload(params, (err, data) => {
//   if (err) {
//     console.log('Error', err);
//   }
//   if (data) {
//     console.log('Uploaded in', data.Location);
//   }
// });

// s3.getObject(params, (err, data) => {
//   if (err) {
//     console.log('ERROR', err);
//   }
//   if (data) {
//     console.log('DATA', data.Body.toString());
//     // fs.writeFileSync(`./${Date.now()}.txt`, data.Body);
//   }
// });

//Server SetUp
const app = express();

//sequelize
const { sequelize } = require('./models');

//middleware
app.use(cors());

app.use(express.json()); //req.body

//declaring port
var PORT = process.env.PORT || 5000;

// const test = app.address()
//ROUTES//
app.use('/api/prescription', prescription);
app.use('/api/report', report);
app.use('/api/patient', patient);
app.use('/api/doctor', doctor);
app.use('/api/monitoring', monitoring);
app.use('/api/image', image);
app.use('/ping', ping);

// server listening
app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  await sequelize.authenticate();
  console.log('Connected to PostgreSQL');
});
