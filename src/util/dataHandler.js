// import {writable} from 'svelte/store'
// // export let result = writable({})
// // export let query = writable({})

// // $: {result.set(query)}



// const Db = require('tingodb')().Db
// const path = require('path');
// const fs = require('fs')
// const csvParser = require('csv-parser')
// const ObjectID = require('tingodb/lib/ObjectId');
// const { takeWhile } = require('lodash');
// // export const dbStatus = writable({ status: `Error : please check if the database is readable` })
// const db = new Db(path.join(__dirname, 'data'), {});
// const collection = db.collection("books");
// const ERROR = {queryError:true}


// console.log('from within datahandler')

// async function selector(query = {}) {
//   if (Array.isArray(query)) {
//     let cur = await collection.find({ hello: { $in: query } })
//     cur.toArray((err, result) => console.log(result))
//   }
//   else {
//     let cur = await collection.find({})
//     cur.toArray((err, result) => console.log(result))
//   }
// }

// async function insertNew(newBook) {
//   if (newBook) {
//     collection.insert(newBook, console.log)
//   }
// }

// async function edit(query) {
//   if (query._id) {
//     collection.update({ _id: query._id }, { $set: { ...query, _id: new ObjectID(query._id) } }, console.log)
//   }
// }

// async function remove(query) {
//   if (query) {
//     let operation = await collection.remove(query)
//     return operation
//   }
//   else console.log('no query spesified')
// }

// // edit({ _id: 8,hello: `world ${new Date()}`}).then(_=>  selector() )
// // // remove({ _id: 9}).then(_=>  selector() )
// // insertnew({hello:`world_safe ${~~(Math.random()*100)}`, newEntry: 'damn right'}).then(_=> selector())
// //seeding

// function recordTransformer(raw) {
//   return {
//     ...raw,
//     // judul:raw.judul.toUpperCase(),
//     // pengarang: raw.pengarang.toUpperCase(),
//     // penerbit: raw.penerbit.toUpperCase(),
//     lokasiPenerbit: raw.lokasiPenerbit.toLowerCase(),
//     kategori: raw.kategori.toLowerCase(),
//     statusPinjam: raw.statusPinjam || 0,
//     tanggalPinjam: raw.tanggalPinjam || 0,

//     edisi: parseInt(raw.edisi) || 0,
//     cetakan: parseInt(raw.cetakan) || 0,
//     tahunTerbit: dateTransformer(`1/2/${raw.tahunTerbit}`),
//     tanggalBeli: dateTransformer(raw.tanggalBeli),
//     hargaBeli: parseInt(raw.hargaBeli) || 0
//   }
// }

// function dateTransformer(d) {
//   if (isNaN(new Date(d))) {
//     return 0
//   }
//   else return new Date(d)
// }

// let seedAmount = 0;

// function seed() {
//   fs.createReadStream('daftar-7.csv')
//     .pipe(csvParser({ separator: ';' }))
//     .on('data', (data) => {
//       seedAmount++
//       // console.log(recordTransformer(data)
//       if(data.judul) insertNew(recordTransformer(data))
//     })
//     .on('end', (_) => console.log(seedAmount))
// }

// function dbStatusSetter(err,result){
//     if(!err)    dbStatus.set(result)
//     else dbStatus(err)
// }

