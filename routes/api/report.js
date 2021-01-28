const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const d = new Date();
const yyyy = d.getFullYear();
const mm = d.getMonth() + 1;
const ym = mm < 10 ? '-0' : '-';
const dd = d.getDate();
const md = dd < 10 ? '-0' : '-';
const date = yyyy + ym + mm + md + dd;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('test', req.params);
    const { patientId } = req.params;
    const dir = `files/${patientId}/reports/${date}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${yyyy}${ym}${mm}${md}${dd}.txt`);
  },
});
const upload = multer({ storage: storage });

// METHOD POST

// Receiving Report
router.post('/upload/:patientId', upload.single('file'), (req, res, next) => {
  console.log(req.file);
  if (!req.file) {
    res.json({ error: 'upload failed' });
    return;
  }

  res.send('Oyeee!!');
  // MongoClient.connect(url, (err, db) => {
  //     assert.equal(null, err);
  //     insertDocuments(db, 'public/images/uploads/' + req.file.filename, () => {
  //         db.close();
  //         res.json({'message': 'File uploaded successfully'});
  //     });
  // });
});

module.exports = router;
