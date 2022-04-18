const express = require('express');
const fs = require('fs');

const router = express.Router();

const getNames = function () {
  return new Promise((resolve, reject) => {
    fs.readFile('./names.json', (err, data) => {
      if (err) {
        reject('unable to read');
      }
      resolve(JSON.parse(data));
    });
  });
};

const checkMatchingName = async function (q) {
  let names = await getNames();

  //console.log(names);
  let matchingNames = [];
  q = q.toLowerCase();

  for (let i = 0; i < names.length; i++) {
    let flag = true;

    let name = names[i].toLowerCase();

    for (let char of q) {
      let charIndex = name.indexOf(char);
      if (charIndex === -1) {
        flag = false;
        break;
      }

      name = name.slice(charIndex + 1);
    }
    if (flag) {
      matchingNames.push(names[i]);
    }
  }

  return matchingNames;
};

router.get('/search', async (req, res) => {
  let query = req.query.q;
  console.log('query', query);

  let matching = await checkMatchingName(query);

  res.status(200).json({
    message: 'success',
    query,
    matching: JSON.stringify(matching),
    u: matching.includes('Amandeep Singh'),
  });
});

module.exports = router;

let fruits = ['apple', 'banana', 'oranges', 'cherry'];
let count = 0;
let N = fruits.length;
for (let index = 0; index < N; index++) {
  if (index > 2) {
    fruits.push('New fruit');
  } else {
    count++;
  }
}

//console.log(count); // What's the output 3
//console.log(fruits); // what's the output ['apple', 'banana', 'oranges', 'cherry','New fruit'];
// what's the problem
