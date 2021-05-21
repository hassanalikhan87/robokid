const express = require('express');
const cors = require('cors');
const fs = require('fs');
const aws = require('aws-sdk');

//importing routes
const prescription = require('./routes/api/prescription');
const patient = require('./routes/api/patient');
const doctor = require('./routes/api/doctor');
const monitoring = require('./routes/api/monitoring');
const report = require('./routes/api/report');
const image = require('./routes/api/image');
const ping = require('./routes/api/ping');

// fs.mkdirSync('files');
//heroku config:set AWS_ACCESS_KEY_ID=AKIAW3N6SFH7RXXOTJGJ AWS_SECRET_ACCESS_KEY=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

//heroku config:set S3_BUCKET=testqq

aws.config.region = 'us-east-2';

const S3_BUCKET = process.env.S3_BUCKET;

//Server SetUp
const app = express();

//sequelize
const { sequelize } = require('./models');

//middleware
app.use(cors());

app.use(express.json()); //req.body

//declaring port
var PORT = process.env.PORT || 5000;

// const test = app.address()
//ROUTES//
app.use('/api/prescription', prescription);
app.use('/api/report', report);
app.use('/api/patient', patient);
app.use('/api/doctor', doctor);
app.use('/api/monitoring', monitoring);
app.use('/api/image', image);
app.use('/ping', ping);
app.get('/s', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

// server listening
app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  await sequelize.authenticate();
  console.log('Connected to PostgreSQL');
});
