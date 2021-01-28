const express = require('express');
const cors = require('cors');

//importing routes
const prescription = require('./routes/api/prescription');
const patient = require('./routes/api/patient');
const doctor = require('./routes/api/doctor');
const monitoring = require('./routes/api/monitoring');
const report = require('./routes/api/report');

//Server SetUp
const app = express();

//sequelize
const { sequelize } = require('./models');

//middleware
app.use(cors());

app.use(express.json()); //req.body

// console.log(sequelize.models);
//declaring port
var PORT = process.env.PORT || 8080;

// const test = app.address()
//ROUTES//
app.use('/api/prescription', prescription);
app.use('/api/report', report);
app.use('/api/patient', patient);
app.use('/api/doctor', doctor);
app.use('/api/monitoring', monitoring);
app.use(express.static(__dirname));

// server listening
app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  await sequelize.authenticate();
  console.log('Connected to PostgreSQL');
});

// "username": "gntorzikmjnajc",
// "port": 5432,
// "password": "7285adccafb5cdd6644b85f97cc5d24fca9c8e8e51f605e0719e8af299a49f01",
// "database": "des9e48j578iol",
// "host": "ec2-54-211-55-24.compute-1.amazonaws.com",
// "dialect": "postgres"
