const express = require("express");
const fs = require("fs");

const router = express.Router();

/**
 * Retrieves all names from the "names.json" file.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of names.
 * @throws {string} If there is an error reading the file.
 */
const getAllNames = function () {
  return new Promise((resolve, reject) => {
    fs.readFile("./names.json", (err, data) => {
      if (err) {
        reject("Unable to read names.json file");
      }
      resolve(JSON.parse(data));
    });
  });
};

/**
 * Checks if a given query matches a name in a fuzzy manner.
 *
 * @param {string} q - The query string to match.
 * @param {string} name - The name to compare against the query.
 * @returns {boolean} - Returns true if the query matches the name in a fuzzy manner, false otherwise.
 */
function fuzzyMatch(q, name) {
  // for each char in query string
  for (let char of q) {
    // find the index of the char in the name
    let charIndex = name.indexOf(char);
    // if the char is not found in the name return false
    if (charIndex === -1) {
      return false;
    }
    // search for the next char in substring of name starting from the index of the current char
    // as chars can be repeated and matching needs to be done in order
    name = name.slice(charIndex + 1);
  }
  return true;
}

/**
 * Retrieves an array of matching names based on the provided query.
 *
 * @param {string} q - The query string to match against names.
 * @returns {Promise<Array<string>>} - A promise that resolves to an array of matching names.
 */
const getMatchingNames = async function (q) {
  let names = await getAllNames();

  let matchingNames = [];

  q = q.toLowerCase();

  for (let i = 0; i < names.length; i++) {
    let name = names[i].toLowerCase();

    if (fuzzyMatch(q, name)) {
      matchingNames.push(names[i]);
    }
  }

  return matchingNames;
};

router.get("/search", async (req, res) => {
  let query = req.query.q;

  let matchingNames = await getMatchingNames(query);

  res.status(200).json({
    message: "success",
    query,
    matchingNames,
    isFound: matchingNames.length > 0,
  });
});

module.exports = router;
