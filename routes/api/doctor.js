const express = require('express');
const router = express.Router();

const { Doctor } = require('../../models');

//METHOD POST

//CREATE A NEW DOCTOR
router.post('/', async (req, res) => {
  const {
    doctorName,
    email,
    phoneNumber,
    hospital,
    address,
  } = req.body.newDoctor;

  await Doctor.create({
    doctorName,
    email,
    phoneNumber,
    hospital,
    address,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => res.json(err));
});

//METHOD GET

//GET ALL DOCTORS
router.get('/', async (req, res) => {
  await Doctor.findAll()
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => res.json(err));
});

//GET A SPECIFIC DOCTOR BY id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  await Doctor.findByPk(id)
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => res.json(err));
});

module.exports = router;
