const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

//sequelize
const { sequelize } = require('./models');

//importing routes
const prescription = require('./routes/api/prescription');
const patient = require('./routes/api/patient');
const doctor = require('./routes/api/doctor');
const monitoring = require('./routes/api/monitoring');
const report = require('./routes/api/report');

//Server SetUp
const app = express();
const server = http.createServer(app);

//Calling Socket IO
const io = socketIo(server);
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

let interval;

// opening socket connection
io.on('connection', (socket) => {
  const { patientId } = socket.handshake.query;
  socket.join(patientId);
  console.log(`New client connected ${patientId}`);

  // console.log(sequelize.models);

  // sequelize.models.LiveReadings.findOne({
  //   where: { patientId },
  // })
  //   .then((pres) => {
  //     console.log(pres);
  socket.to(patientId).emit('FromAPI', patientId);
  // })
  // .catch((err) => console.log('FromAPI', err));

  // if (interval) {
  //   clearInterval(interval);
  // }
  // interval = setInterval(() => {
  //   // console.log(new Date());
  //   getApiAndEmit(socket, patientId);
  // }, 1000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // clearInterval(interval);
  });
});

app.use(express.static(__dirname));
// const getApiAndEmit = (socket, patientId) => {
//   // console.log(socket);
//   sequelize.models.Prescription.findAll({
//     where: { isLatest: true },
//   })
//     .then((pres) => {
//       // console.log(pres);
//       socket.to(patientId).emit('FromAPI', patientId);
//     })
//     .catch((err) => console.log('FromAPI', err));
// };

// server listening
server.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  await sequelize.authenticate();
  console.log('Connected to PostgreSQL');
});

//this is alpha
