const express = require('express');
const router = express.Router();
const path = require('path');
// const multer = require('multer');
const formidable = require('formidable');
const fs = require('fs');

router.post('/upload/:patientId', (req, res) => {
  const { patientId } = req.params;
  var form = new formidable.IncomingForm();
  form.uploadDir = `files/${patientId}/image`;
  form.keepExtensions = true;
  form.multiples = false;
  // console.log(req.files);

  form.parse(req, (err, fields, files) => {
    console.log('files', files.file.path);
    //   console.log('fields', fields);
    // res.send(files);
    // const filename = fs.readdirSync(form.uploadDir);
    // console.log(filename);
    const oldPath = files.file.path;
    const newPath = `files/${patientId}/image/${patientId}.jpg`;
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.log('err');
        res.send(err);
      }
      console.log('no');
      res.send('/' + newPath);
    });
  });
});

router.get('/download/:patientId', (req, res) => {
  const { patientId } = req.params;
  console.log(patientId);
  const dir = `files/${patientId}/image/${patientId}.jpg`;
  if (!fs.existsSync(dir)) {
    res.send('Wrong Path');
  } else {
    fs.readFile(dir, 'base64', (err, profilePic) => {
      const url = `data:image/jpeg;base64,${profilePic}`;
      return res.send(url);
    });
  }
});

module.exports = router;
