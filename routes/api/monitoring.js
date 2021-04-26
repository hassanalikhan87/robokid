const express = require('express');
const router = express.Router();

const { LiveReadings } = require('../../models');

//METHOD POST

router.put('/:patientId', async (req, res) => {
  console.log(req.body);
  const { patientId } = req.params;
  const {
    volume,
    ipc_states,
    currentState,
    cycles,
    therapyTime,
    patientPressure,
    sourcePressure,
    rpm,
    sourceBag,
    isPatientPressure,
    isSourcePressure,
    isWsTamper,
    targetVolume,
    isActive,
  } = req.body;

  console.log(req.body);
  console.log(patientId, volume);

  await LiveReadings.findAll({ where: { patientId: patientId } })
    .then(async (obj) => {
      const lr = await obj.length;
      // update
      if (lr > 0) {
        //lr is length of array
        console.log(2, obj.length);
        return LiveReadings.update(
          {
            volume,
            ipc_states,
            currentState,
            cycles,
            therapyTime,
            patientPressure,
            sourcePressure,
            rpm,
            sourceBag,
            isPatientPressure,
            isSourcePressure,
            isWsTamper,
            targetVolume,
            isActive,
          },
          { where: { patientId } },
        )
          .then((vol) => res.json('Gooo'))
          .catch((err) => {
            console.log(err);
            res.json(err);
          });
      }
      // insert
      else {
        console.log(3);
        return LiveReadings.create({
          patientId,
          volume,
          ipc_states,
          currentState,
          cycles,
          therapyTime,
          patientPressure,
          sourcePressure,
          rpm,
          sourceBag,
          isPatientPressure,
          isSourcePressure,
          isWsTamper,
          targetVolume,
          isActive,
        })
          .then((vol) => res.json(vol))
          .catch((err) => {
            console.log(err);
            res.json(err);
          });
      }
    })
    .catch((err) => res.json(err));
});

router.get('/:patientId', async (req, res) => {
  const { patientId } = req.params;
  console.log(1);
  await LiveReadings.findOne({ where: { patientId } })
    .then((obj) => {
      console.log(obj.isActive);
      if (obj.isActive) {
        const limit = Date.now() - Date.parse(obj.updatedAt);
        console.log('limit1', limit);
        if (limit > 20000) {
          console.log(22);
          return LiveReadings.update(
            {
              isActive: false,
            },
            { where: { patientId } },
          )
            .then((obj) => {
              res.json(obj);
            })
            .catch((err) => console.log(err));
        }
        console.log('limit2', limit);
        // console.log(Date.parse(obj.updatedAt));
        // console.log(obj.updatedAt);
        // console.log(Date.now());
        res.json(obj);
      } else {
        res.json(obj);
      }
    })
    .catch((err) => res.json(err));
});

module.exports = router;

// volume,
// currentState,
// cycle,
// time,
// patientPressure,
// sourcePressure,
// rpm,
// sourceBag,
// isPatientPressure,
// isSourcePressure,
// isWsTamper,
// isIpcError,
// targetVolume,
