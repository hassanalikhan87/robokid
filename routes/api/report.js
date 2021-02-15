const express = require('express');
const router = express.Router();
const multer = require('multer');
const formidable = require('formidable');
const fs = require('fs');

const d = new Date();
const utc = d.toUTCString();
const yyyy = d.getUTCFullYear();
const mm = d.getUTCMonth() + 1;
const ym = mm < 10 ? '-0' : '-';
const dd = d.getUTCDate();
const md = dd < 10 ? '-0' : '-';
const date = yyyy + ym + mm + md + dd;

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log(file);
//     // console.log('test', req.params);
//     // fs.readFile(file + '.txt', (err, data) => {
//     //   console.log(data);
//     // });
//     // console.log('filename: ', file.originalname);
//     const { patientId } = req.params;
//     const dir = `files/${patientId}/reports/${date}`;
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir);
//     }

//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     console.log(req);
//     console.log(file);
//     cb(null, `${yyyy}${ym}${mm}${md}${dd}.txt`);
//   },
// });
// const upload = multer({ storage: storage });

// METHOD POST

// Receiving Report
// router.post('/upload/:patientId', upload.single('file'), (req, res, next) => {
//   // console.log(req.file);
//   // console.log(req.body.test1);

//   if (!req.file) {
//     res.json({ error: 'upload failed' });
//     return;
//   }

//   res.send('Success!');
// });

router.post('/upload/:patientId', (req, res) => {
  const form = new formidable.IncomingForm();
  const { patientId } = req.params;
  form.parse(req, (err, fields, files) => {
    const oldPath = files.file.path;
    const destPath = `files/${patientId}/reports/${date}`;
    console.log(utc);

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath);
    }

    fs.readdir(destPath, (err, files) => {
      const length = files.length;
      const ext = `/${utc}.json`;
      const newPath = destPath + ext;
      try {
        if (fs.existsSync(newPath)) {
          const a = 0;
          const path = destPath + a;
          console.log(path);
          console.log('exist');
          //file exists
        } else {
          fs.renameSync(oldPath, newPath, (err) => {
            if (err) throw err;
          });
          res.send('done');
        }
      } catch (err) {
        console.error(err);
      }
    });

    let data;
    const readStream = fs.createReadStream(oldPath, 'utf8');
    readStream
      .on('data', (chunk) => {
        data = chunk;
      })
      .on('end', () => {
        // console.log(JSON.stringify(data));
        const json = JSON.parse(data);
        // console.log(json);
      });
    // fs.readFile(oldPath, (err, data) => {
    //   console.log('data', 'utf8', data);
    //   res.send(data);
    // });

    // fs.renameSync(oldPath, newPath, (err) => {
    //   if (err) throw err;
    //   res.send('done');
    // });
    // console.log(test);
    // console.log(files.file.path);
    // console.log(fields);
  });
  // console.log(__dirname);
  // form.on('fileBegin', function (name, file) {
  //   file.path = __dirname;
  // });

  // form.on('file', function (name, file) {
  //   console.log('Uploaded ' + file.name);
  // });
  // res.send('Success!');
});

//Access Patient Report List for APP
router.get('/daily/:patientId', async (req, res) => {
  const { patientId } = req.params;
  const dir = `files/${patientId}/reports/`;

  const data = [];
  fs.readdir(dir, (err, dates) => {
    console.log(dates);
    dates.map((date) => {
      const folder = dir + date;
      fs.readdir(folder, (err, report) => {
        data.push({ date, report });
        console.log(data);
      });
      // console.log(data);
    });
    // res.json(gg);
    // res.send(files.reverse());
  });
});

router.get('/list/:date/:patientId', (req, res) => {
  const { patientId } = req.params;
  const { date } = req.params;
  // console.log(req.params);
  const dir = `files/${patientId}/reports/${date}`;
  if (!fs.existsSync(dir)) {
    res.send('Wrong Path');
  } else {
    fs.readdir(dir, (err, files) => {
      list = files.map((fl) => fl.split('.')[0]);
      // res.send(files.reverse());
      res.send(list.reverse());
    });
  }
});

//Access Patient Report for APP
router.get('/report/:patientId/:date', async (req, res) => {
  const { patientId, date } = req.params;
  console.log(new Date(date).getUTCDate());
  const day = new Date(date).getUTCDate();
  const month = new Date(date).getUTCMonth() + 1;
  const year = new Date(date).getUTCFullYear();
  const monthSeparator = month < 10 ? '0' : '';
  const daySeparator = day < 10 ? '0' : '';
  const dirname = `${year}-${monthSeparator + month}-${daySeparator + day}`;
  console.log(dirname);
  const file = `files/${patientId}/reports/${dirname}/${date}.json`;
  let data;
  const readStream = fs.createReadStream(file, 'utf8');
  readStream
    .on('data', (chunk) => {
      data = chunk;
    })
    .on('end', () => {
      // console.log(JSON.stringify(data));
      const json = JSON.parse(data);
      res.json(json);
    });

  // fs.readFile(file, (err, data) => {
  //   // const uf = data.toString().split('TARGET_UF_ML ').pop().split('\n')[0];
  //   // res.send({ uf });
  //   console.log(data);
  // });
});

module.exports = router;
