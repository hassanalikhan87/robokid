const express = require('express');
const router = express.Router();
const fs = require('fs');

const { Prescription } = require('../../models');

router.post('/', async (req, res) => {
  const {
    patientId,
    machineId,
    fillVolume,
    dwellTime,
    expectedUF,
    totalCycles,
    lastFill,
    lastFillVolume,
  } = req.body.newPrescription;
  let lastFillBoolean;
  if (lastFill) {
    lastFillBoolean = 1;
  } else {
    lastFillBoolean = 0;
  }
  const content =
    'PATIENT_ID ' +
    patientId +
    '\n' +
    'MACHINE_ID ' +
    machineId +
    '\n' +
    'CYCLES ' +
    totalCycles +
    '\n' +
    'FILL_VOLUME_ML ' +
    fillVolume +
    '\n' +
    'DWELL_TIME_SECONDS ' +
    dwellTime +
    '\n' +
    'TARGET_UF_ML ' +
    expectedUF +
    '\n' +
    'LAST_FILL_BOOLEAN ' +
    lastFillBoolean +
    '\n' +
    'LAST_FILL_VOLUME_ML ' +
    lastFillVolume;

  await Prescription.create({
    dwellTime,
    fillVolume,
    expectedUF,
    totalCycles,
    lastFill,
    patientId,
    machineId,
    lastFillVolume,
  })
    .then((pres) => {
      const dir = `files/${pres.patientId}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const dir1 = `files/${pres.patientId}/prescriptions`;
      if (!fs.existsSync(dir1)) {
        fs.mkdirSync(dir1);
      }
      fs.writeFile(
        `files/${pres.patientId}/prescriptions/${pres.patientId}_current.txt`,
        content,
        { recursive: true },
        (err) => {
          if (err) throw err;
          console.log('file created');
        },
      );
      res.json(pres);
    })
    .catch((err) => res.json(err));
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
  const file = `files/${patientId}/prescriptions/${patientId}_current.txt`;
  res.download(file);
  // res.sendFile(file);
});

//Access Patient Report List for APP
router.get('/reportlist/:patientId', (req, res) => {
  const { patientId } = req.params;
  const dir = `files/${patientId}/reports/`;
  fs.readdir(dir, (err, files) => {
    if (!err) {
      let list = [];
      // console.log(files);
      if (files.length > 0) {
        files.reverse().map((fl) => {
          console.log('!err');
          const file = `files/${patientId}/reports/${fl}/${fl}.txt`;
          fs.readFile(file, (error, data) => {
            if (!error) {
              const text = data.toString();
              const uf = text.split('TARGET_UF_ML ').pop().split('\n')[0];
              list.push({ date: fl, uf: uf });
              if (files.length === list.length) {
                const output = list;
                res.json(output);
              }
            } else {
              console.log('error');
              res.send(error);
            }
          });
        });
      } else {
        res.send(err);
      }
    } else {
      res.send(err);
    }
  });
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

//METHOD: POST

//POSTING A NEW PRESCRIPTION
// router.post('/', async (req, res) => {
//   const {
//     patientId,
//     machineId,
//     fillVolume,
//     dwellTime,
//     expectedUF,
//     totalCycles,
//     lastFill,
//     lastFillVolume,
//   } = req.body.newPrescription;

//   await Prescription.create({
//     dwellTime,
//     fillVolume,
//     expectedUF,
//     totalCycles,
//     lastFill,
//     patientId,
//     machineId,
//     lastFillVolume,
//   })
//     .then((pres) => {
//       res.json(pres);
//     })
//     .catch((err) => res.json(err));
// })
