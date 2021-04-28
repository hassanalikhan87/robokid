const express = require('express');
const router = express.Router();
const fs = require('fs');
const { Patient } = require('../../models');

//METHOD: POST

//CREATE A NEW PATIENT
router.post('/', async (req, res) => {
  const {
    patientId,
    doctorId,
    patientAddress,
    patientName,
    phoneNumber,
    email,
    dateOfBirth,
  } = req.body.newPatient;
  if (!fs.existsSync('files')) {
    fs.mkdirSync('files');
  }

  const dir = `files/${patientId}`;
  fs.mkdirSync(dir);

  const dir1 = `${dir}/prescriptions`;

  fs.mkdirSync(dir1);
  const dir3 = `${dir}/reports`;
  if (!fs.existsSync(dir3)) {
    fs.mkdir(dir3, (err) => {
      if (err) {
        console.log('failed to create directory ' + dir3);
        return console.error(err);
      } else {
        console.log(dir3 + ' Directory created successfully');
      }
    });
  }

  fs.writeFile(
    `${dir1}/${patientId}_current.txt`,
    'no content',
    { recursive: true },
    (err) => {
      if (err) throw err;
      console.log('file created');
    },
  );

  await Patient.create({
    patientId,
    doctorId,
    patientAddress,
    patientName,
    phoneNumber,
    email,
    dateOfBirth,
  })
    .then((patient) => {
      res.json(patient);
    })
    .catch((err) => res.json(err));
});

//METHOD: GET

//GET ALL PATIENTS
router.get('/', async (req, res) => {
  await Patient.findAll()
    .then((patient) => {
      res.json(patient);
    })
    .catch((err) => res.json(err));
});

//GET A SPECIFIC PATIENT BY patientId
router.get('/:patientId', async (req, res) => {
  const { patientId } = req.params;
  await Patient.findOne({ where: { patientId } })
    .then((patient) => {
      res.json(patient);
    })
    .catch((err) => res.json(err));
});

module.exports = router;
