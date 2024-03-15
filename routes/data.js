var express = require('express');
const zlib = require('zlib');
const fs = require('fs');

const path = require('path');

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  //res.send('respond with a data resource');
  // const gzip = zlib.createGzip();
  // const fileContents = fs.createReadStream('./wb.json.gz');
  // fileContents.pipe(gzip);

  // res.set({
  //   'Content-Type': 'application/json',
  //   'Content-Encoding': 'gzip',
  // });

  // res.status(200).send(fileContents);

  res.sendFile(path.join(__dirname, 'public', 'wb.json.gz'));

  // const filePath = 'wb.json.gz';
  // const fileContents = fs.createReadStream(filePath);
  // const gzip = zlib.createGzip();

  // res.set({
  //   'Content-Type': 'application/json',
  //   'Content-Encoding': 'gzip',
  //   'Accept-Encoding': 'application/gzip',
  // });

  // const zipped = fileContents.pipe(gzip);
  // // console.log(zipped)
  // zipped.pipe(res);
});

module.exports = router;
