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
      console.log(patient);
      const dir = `files/${patient.patientId}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const dir1 = `files/${patient.patientId}/prescriptions`;
      if (!fs.existsSync(dir1)) {
        fs.mkdirSync(dir1);
      }
      console.log(patient);
      const dir3 = `files/${patient.patientId}/reports`;
      if (!fs.existsSync(dir3)) {
        fs.mkdirSync(dir3);
      }
      fs.writeFile(
        `files/${patient.patientId}/prescriptions/${patient.patientId}_current.txt`,
        'no content',
        { recursive: true },
        (err) => {
          if (err) throw err;
          console.log('file created');
        },
      );
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
