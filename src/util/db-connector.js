const Db = require('tingodb')().Db
const path = require('path');

const ObjectID = require('tingodb/lib/ObjectId');
const { takeWhile } = require('lodash');
const db = new Db(path.join(__dirname, 'data'), {});


console.log("LOCAL  tingodb info",db)

export const collection = db.collection("books");
export const borrowers = db.collection("borrowers");
export const lendings = db.collection("lendings");







