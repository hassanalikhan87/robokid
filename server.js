const express = require('express');
const cors = require('cors');
const fs = require('fs');
// const path = require('path');

// const dirPath = path.join(__dirname, '/files');
// fs.mkdirSync(dirPath);

//importing routes
const prescription = require('./routes/api/prescription');
const patient = require('./routes/api/patient');
const doctor = require('./routes/api/doctor');
const monitoring = require('./routes/api/monitoring');
const report = require('./routes/api/report');
const image = require('./routes/api/image');
const ping = require('./routes/api/ping');

//Server SetUp
const app = express();

//sequelize
const { sequelize } = require('./models');

//middleware
app.use(cors());

app.use(express.json()); //req.body

// console.log(sequelize.models);
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
// express.static(path.join(__dirname, '/public'));

// server listening
app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  await sequelize.authenticate();
  console.log('Connected to PostgreSQL');
});

//26/04/21
