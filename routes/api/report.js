const express = require('express');
const router = express.Router();
const csv = require('csvtojson');
const formidable = require('formidable');
const fs = require('fs');
const AWS = require('aws-sdk');
const path = require('path');

// const d = new Date();
// const utc = d.toUTCString();
// const yyyy = d.getUTCFullYear();
// const mm = d.getUTCMonth() + 1;
// const ym = mm < 10 ? '-0' : '-';
// const dd = d.getUTCDate();
// const md = dd < 10 ? '-0' : '-';
// const date = yyyy + ym + mm + md + dd;

const ID = 'AKIAW3N6SFH7VAQWMM2D';
const SECRET = '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';
const BUCKET_NAME = 'testqq';

AWS.config.update({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

const s3 = new AWS.S3();

router.get('/r1', (req, res) => {
  console.log(req.query);
  const d = new Date();
  // const utc = d.toUTCString();
  const yyyy = d.getUTCFullYear();
  const mm = d.getUTCMonth() + 1;
  const ym = mm < 10 ? '-0' : '-';
  const dd = d.getUTCDate();
  const md = dd < 10 ? '-0' : '-';
  const date = yyyy + ym + mm + md + dd;
  fs.mkdir(utc, (err) => {
    if (fs.existsSync(utc)) {
      console.log('created');
    }
    if (err) throw err;
    res.send(utc);
  });
});

router.post('/upload/:patientId', (req, res) => {
  const form = new formidable.IncomingForm();
  const { patientId } = req.params;
  const d = new Date();
  const utc = d.toUTCString();
  const yyyy = d.getUTCFullYear();
  const mm = d.getUTCMonth() + 1;
  const ym = mm < 10 ? '-0' : '-';
  const dd = d.getUTCDate();
  const md = dd < 10 ? '-0' : '-';
  const date = yyyy + ym + mm + md + dd;

  form.parse(req, (err, fields, files) => {
    const oldPath = files.file.path;
    const destPath = `${patientId}/reports/${date}/${utc}.csv`;
    const params = {
      Bucket: BUCKET_NAME,
      Body: fs.createReadStream(oldPath),
      Key: destPath,
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.log('Error', err);
      }
      if (data) {
        console.log('Uploaded in', data.Location);
        res.send(data.Location);
        res.end();
      }
    });
  });
});

//Access Patient Report List for APP
router.get('/daily/:patientId', async (req, res) => {
  const { patientId } = req.params;
  const dir = `${patientId}/reports/`;
  const params = {
    Bucket: BUCKET_NAME,
    Prefix: dir,
  };
  s3.listObjects(params, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(
      data.Contents.map((key) => key.Key.split('/')[2])
        .filter((c, index) => {
          return (
            data.Contents.map((key) => key.Key.split('/')[2]).indexOf(c) ===
            index
          );
        })
        .reverse(),
    );
  });
});

router.get('/list/:date/:patientId', (req, res) => {
  const { patientId } = req.params;
  const { date } = req.params;
  console.log(req.params);
  const dir = `${patientId}/reports/${date}`;

  const params = {
    Bucket: BUCKET_NAME,
    Prefix: dir,
  };
  s3.listObjects(params, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(
      data.Contents.map((key) => key.Key.split('/')[3].split('.')[0]).reverse(),
    );
  });
});

//Access Patient Report for APP
router.get('/report/:patientId/:date', async (req, res) => {
  const { patientId, date } = req.params;

  console.log(req.params);
  console.log(new Date(date).getUTCDate());
  const day = new Date(date).getUTCDate();
  const month = new Date(date).getUTCMonth() + 1;
  const year = new Date(date).getUTCFullYear();
  const monthSeparator = month < 10 ? '0' : '';
  const daySeparator = day < 10 ? '0' : '';
  const dirname = `${year}-${monthSeparator + month}-${daySeparator + day}`;
  console.log(dirname);
  const file = `${patientId}/reports/${dirname}/${date}.csv`;
  const params = {
    Bucket: BUCKET_NAME,
    Key: file,
  };
  s3.getObject(params, (err, data) => {
    if (err) {
      console.log('ERROR', err);
    }
    if (data) {
      console.log(data);
      // console.log('DATA', data.Body.toString());
      // const file = data.Body.toString().split('\n');
      const file = data.Body.toString();
      // const dat = file
      //   .map((f) => {
      //     if (f[0] === '-') {
      //       f = '-,-,-,-,' + f;
      //     }
      //     return f;
      //   })
      //   .join('\n');
      csv()
        .fromString(file)
        // .fromString(newFile)
        .then((jsonObj) => {
          console.log(jsonObj);
          const jsn = JSON.stringify(jsonObj).replace(/[ ]/g, '');
          const output = JSON.parse(jsn);
          // if (output[0].InitialDrain < 0) {
          //   output[0].InitialDrain = output[0].InitialDrain * -1;
          //   console.log(output[0].InitialDrain);
          // }
          res.json(output);
        });
    }
  });
});

module.exports = router;

// [
//   {
//     InitialDrain: 2094508464,
//     Cycle: 'ID',
//     Fill: '-',
//     Drain: '-',
//     UF: '-',
//     LastFill: '-',
//     FillTime: '-',
//     DrainTime: '0',
//   },
//   {
//     InitialDrain: '-',
//     Cycle: '0',
//     Fill: '0',
//     Drain: '0',
//     UF: '-',
//     LastFill: '-',
//     FillTime: '0',
//     DrainTime: '0',
//   },
//   {
//     InitialDrain: '-',
//     Cycle: 'LF',
//     Fill: '-',
//     Drain: '-',
//     UF: '-',
//     LastFill: '32562',
//     FillTime: '4000219',
//     DrainTime: '-',
//   },
// ];
//////////////////////////////////////////////
// [
//   {
//     InitialDrain: '400',
//     Cycle: 'ID',
//     Fill: '-',
//     Drain: '-',
//     UF: '-',
//     LastFill: '-',
//     FillTime: '-',
//     DrainTime: '5',
//   },
//   {
//     InitialDrain: '-',
//     Cycle: '0',
//     Fill: '400',
//     Drain: '401',
//     UF: '1',
//     LastFill: '-',
//     FillTime: '225',
//     DrainTime: '345',
//   },
//   {
//     InitialDrain: '-',
//     Cycle: '1',
//     Fill: '400',
//     Drain: '401',
//     UF: '1',
//     LastFill: '-',
//     FillTime: '225',
//     DrainTime: '345',
//   },
//   {
//     InitialDrain: '-',
//     Cycle: '2',
//     Fill: '400',
//     Drain: '401',
//     UF: '1',
//     LastFill: '-',
//     FillTime: '225',
//     DrainTime: '345',
//   },
//   {
//     InitialDrain: '-',
//     Cycle: '3',
//     Fill: '400',
//     Drain: '401',
//     UF: '1',
//     LastFill: '-',
//     FillTime: '225',
//     DrainTime: '345',
//   },
//   {
//     InitialDrain: '-',
//     Cycle: 'LF',
//     Fill: '-',
//     Drain: '-',
//     UF: '-',
//     LastFill: '400',
//     FillTime: '3',
//     DrainTime: '-',
//   },
// ];
