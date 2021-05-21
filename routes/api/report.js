const express = require('express');
const router = express.Router();
const csv = require('csvtojson');
const formidable = require('formidable');
const fs = require('fs');

// const d = new Date();
// const utc = d.toUTCString();
// const yyyy = d.getUTCFullYear();
// const mm = d.getUTCMonth() + 1;
// const ym = mm < 10 ? '-0' : '-';
// const dd = d.getUTCDate();
// const md = dd < 10 ? '-0' : '-';
// const date = yyyy + ym + mm + md + dd;

router.get('/r1', (req, res) => {
  console.log(req.query);
  const d = new Date();
  const utc = d.toUTCString();
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
  // console.log('body', req.body);
  // console.log('filepathhassan', req.body.file);
  const form = new formidable.IncomingForm();
  const { patientId } = req.params;

  const dir = `files/${patientId}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir).catch((err) => {
      console.log(err);
    });
  }
  const dir1 = `${dir}/reports`;
  if (!fs.existsSync(dir1)) {
    fs.mkdirSync(dir1);
  }
  form.parse(req, (err, fields, files) => {
    const oldPath = files.file.path;
    const destPath = `files/${patientId}/reports/${date}`;
    const ext = `/${utc}.csv`;
    const newPath = destPath + ext;

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath);
    }
    fs.copyFile(oldPath, newPath, function (err) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      res.send('success');
      res.end();
    });
  });
});

//Access Patient Report List for APP
router.get('/daily/:patientId', async (req, res) => {
  const { patientId } = req.params;
  const dir = `files/${patientId}/reports/`;

  const dates = fs.readdirSync(dir);
  const data = dates.map((date) => {
    const subfolder = fs.readdirSync(dir + date);
    // console.log(zz);
    const reports = subfolder.map((sf) => sf.split('.')[0]);
    return { date, reports };
  });
  res.json(data.reverse());
});

router.get('/list/:date/:patientId', (req, res) => {
  const { patientId } = req.params;
  const { date } = req.params;
  console.log(req.params);
  const dir = `files/${patientId}/reports/${date}`;
  if (!fs.existsSync(dir)) {
    res.send('Wrong Path');
  } else {
    fs.readdir(dir, (err, files) => {
      list = files.map((fl) => fl.split('.')[0]);
      // res.send(files.reverse());
      console.log(list);
      res.send(list.reverse());
    });
  }
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
  const file = `files/${patientId}/reports/${dirname}/${date}.csv`;
  console.log(file);
  csv()
    .fromFile(file)
    .then((jsonObj) => {
      console.log(jsonObj);
      const jsn = JSON.stringify(jsonObj).replace(/[ ]/g, '');
      console.log(jsn);
      res.json(JSON.parse(jsn));
      // fs.writeFileSync(destPath + '/' + utc + '.json', jsn);
    });
});

module.exports = router;
