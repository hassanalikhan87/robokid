const express = require('express');
const router = express.Router();
const fs = require('fs');
const AWS = require('aws-sdk');
const path = require('path');

const { Prescription } = require('../../models');

AWS.config.update({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

const s3 = new AWS.S3();

router.post('/upload/:patientId', async (req, res) => {
  console.log(req.body);
  const { patientId } = req.params;
  const {
    machineId,
    fillVolume,
    dwellTime,
    expectedUF,
    totalCycles,
    lastFill,
    lastFillVolume,
    numberOfBags,
    maxDrain,
  } = req.body.newPrescription;
  let lastFillBoolean;
  if (lastFill) {
    lastFillBoolean = 1;
  } else {
    lastFillBoolean = 0;
  }
  if (maxDrain < fillVolume + expectedUF) {
    res.json({ err: 'No' });
  } else {
    const content =
      'CYCLES ' +
      totalCycles +
      '\n' +
      'FILL_VOLUME_ML ' +
      fillVolume +
      '\n' +
      'MIN_INITIAL_DRAIN_VOLUME_ML 0\n' +
      'MAX_INITIAL_DRAIN_VOLUME_ML 4000\n' +
      'MAX_DRAIN_VOLUME_ML ' +
      maxDrain +
      '\n' +
      'MAX_NEGATIVE_UF_PERCENTAGE 10\n' +
      'PUSHBACK_VOLUME_ML 50\n' +
      'TARGET_UF_ML ' +
      expectedUF +
      '\n' +
      'PERCENTAGE_TARGET_UF 70\n' +
      'DWELL_TIME_SECONDS ' +
      dwellTime +
      '\n' +
      'DRAIN_TIMEOUT_SECONDS 900\n' +
      'NUMBER_OF_BAGS ' +
      numberOfBags +
      '\n' + // / 1 TO 3
      'BAG_VOLUME_ML 2000\n' +
      'DEXTROSE_PERCENTAGE 0\n' +
      'LAST_FILL_BOOLEAN ' +
      lastFillBoolean +
      '\n' +
      'LAST_FILL_VOLUME_ML ' +
      lastFillVolume +
      '\n' +
      'MAX_CUMULATIVE_BUBBLES_CC 5\n' +
      'MAX_ALLOWED_BUBBLE_SIZE_CC 5\n' +
      'MAX_POSITIVE_UF_ML 1750\n' +
      'CUMULATIVE_LOW_UF_CYCLES 3\n' +
      'MAX_CUMULATIVE_POSITIVE_UF_ML 3000\n' +
      'BAG_VOLUME_ML_1 2100\n' +
      'BAG_VOLUME_ML_2 4200\n' +
      'BAG_VOLUME_ML_3 4400\n' +
      'BAG_VOLUME_ML_4 4000\n' +
      'BAG_VOLUME_ML_5 5000\n';
    await Prescription.update(
      { isLatest: false },
      { where: { isLatest: true, patientId } },
    )
      .then(async () => {
        await Prescription.create({
          dwellTime,
          fillVolume,
          expectedUF,
          totalCycles,
          lastFill,
          patientId,
          machineId,
          lastFillVolume,
          maxDrain,
          numberOfBags,
        })
          .then((pres) => {
            const params = {
              Bucket: BUCKET_NAME,
              Body: content,
              Key: `${pres.patientId}/prescriptions/${pres.patientId}_current.txt`,
            };
            s3.upload(params, (err, data) => {
              if (err) {
                console.log('Error', err);
              }
              if (data) {
                console.log('Uploaded in', data.Location);
                res.json('success');
              }
            });
          })
          .catch((err) => res.json(err));
      })
      .catch((err) => res.json(err));
  }
});

//METHOD: GET

//GET ALL PRESCRIPTIONS
router.get('/', async (req, res) => {
  await Prescription.findAll()
    .then((pres) => {
      res.json(pres);
    })
    .catch((err) => res.json(err));
});

//DOWNLOAD PRESCRIPTIONS
router.get('/download/:patientId', async (req, res) => {
  const { patientId } = req.params;
  const file = `${patientId}/prescriptions/${patientId}_current.txt`;
  const params = {
    Bucket: BUCKET_NAME,
    Key: file,
  };
  const readStream = s3
    .getObject(params, (err, data) => {
      if (err) {
        console.log('ERROR', err);
      }
      if (data) {
        console.log('DATA', data.Body.toString());
        // fs.writeFileSync(`./${Date.now()}.txt`, data.Body);
      }
    })
    .createReadStream();
  readStream.pipe(res);
  // res.download(readStream);
  // res.download(file);
  // res.sendFile(file);
});

//Access Patient Report for APP
router.get('/report/:patientId/:date', async (req, res) => {
  const { patientId, date } = req.params;
  const file = `files/${patientId}/reports/${date}/${date}.txt`;
  fs.readFile(file, (err, data) => {
    const uf = data.toString().split('TARGET_UF_ML ').pop().split('\n')[0];
    res.send({ uf });
  });
});

//GETTING A SPECIFIC PATIENT's ACTIVE PRESCRIPTION
router.get('/:patientId', async (req, res) => {
  const { patientId } = req.params;
  await Prescription.findAll({ where: { patientId, isLatest: true } })
    .then((pres) => {
      res.json(pres);
    })
    .catch((err) => res.json(err));
});

//METHOD: PUT

//UPDATING THE LAST ROW isLatest COLUMN TO FALSE
router.put('/:patientId', async (req, res) => {
  const { patientId } = req.params;
  await Prescription.update(
    { isLatest: false },
    { where: { isLatest: true, patientId } },
  )
    .then((pres) => res.json(pres))
    .catch((err) => res.json(err));
});

module.exports = router;
