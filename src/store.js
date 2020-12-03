import { writable, get } from 'svelte/store';
import { columnHeaderFormater } from "./util/data-transform-map";
import { collection, borrowers, lendings } from "./util/db-connector";
import Swal from 'sweetalert2';
import { compute_rest_props } from 'svelte/internal';


let defaultColumns = Object.keys(columnHeaderFormater)

export let query = writable({});
export let pageNumbers = writable([]);
export let data = writable([]);
export let sorter = writable({ _id: -1 })
export let total = writable(0);
export let recordPerPage = writable(10);
export let pageMap = writable([]);
export let lastPage = writable(0);

export let skip = get(recordPerPage);




function generatePagerNumbers(max, limit) {
    let result = [];

    for (let i = 0; i < Math.ceil(max / limit); i++) {
        result.push(i);
    }
    console.log("generated page number", result);
    return result;
}

// export function populateList(queryx, message) {
//     if (queryx) query.set(queryx);

//     let cursor = collection.find(get(query)).sort(get(sorter));
//     cursor.count((err, counted) => {
//         if (err) throw 'cannot count --populateList';
//         else {
//             total.set(counted);          
//         }
//     });

//     cursor
//         .skip(0)
//         .limit(get(recordPerPage))
//         .toArray((_, dat) => {
//             data.set(dat);
//             console.log(message, dat);
//         });
// }

//initial
// populateList();


export function gotoPage(pageNumber, sorterX) {
    if (!pageNumber) pageNumber = get(lastPage)

    pageNumber--;
    let toSkip = get(recordPerPage) * pageNumber;
    // console.log(`going to ${pageNumber} query is ${JSON.stringify(get(query))} skipping ${toSkip} --gotoPage`)
    let cursor = collection.find(get(query))
    cursor.count((err, amount) => {
        if (err) throw 'cannot set new total after page jumping --gotoPage'
        total.set(amount)
        // console.log(`total is now ${get(total)} --gotoPage`)

    })
    // console.log(`skipping ${toSkip} records, and limitting result to ${get(recordPerPage)} --gotoPage`)      

    let sorterY = get(sorter)
    if (sorterX) sorterY = sorterX
    console.log('gotoPage with this Sorter ', JSON.stringify(sorterY))
    collection.find(get(query)).sort(sorterY)
        .skip(toSkip).limit(get(recordPerPage))
        .toArray((err, dat) => {
            if (err) 'cannot iterate over the cursor --gotoPage'
            // data.set(dat) 
            data.set(dat)
        })
}

function preprocessBookData(formData, newKategori, isCreate) {

    if (newKategori) {
        formData.kategori.push(...newKategori);
        formData.kategori = Array.from(new Set(formData.kategori));
    }

    if (isCreate) formData._id = new Date().getTime();

    formData.modifiedAt = new Date();
    formData.lokasiPenerbit = formData.lokasiPenerbit.toLowerCase();

    return formData
}

export function saveNew(formData, newKategori, callback) {
    if (formData.judul) {
        //saving new book codes
        //adding new kategori to old kategori
        formData = preprocessBookData(formData, newKategori, true)
        collection.insert(formData, (error, result) => {
            if (error) {
                Swal.fire({
                    icon: "error",
                    title: "ERROR",
                    text: "Something wrong when inserting data",
                    footer: error,
                });
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `Buku ${formData.judul} id:${formData._id}, telah ditambahkan`,
                    showConfirmButton: false,
                    timer: 3000,
                });

                lastPage.set(1)
                gotoPage(get(lastPage), { _id: -1 })

                if (callback) callback();
            }
        });
    } else {
        Swal.fire("Judul wajib diisi");
    }
}


export function editBook(formData, newKategori, callback) {
    if (formData.judul) {
        formData = preprocessBookData(formData, newKategori)
        Swal.fire({
            title: "Edit buku ini?",
            text: `Anda akan mengedit,  "${formData.judul}"`,
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Simpan",
        }).then((result) => {
            if (result.isConfirmed) {
                collection.update({ _id: formData._id }, { $set: formData }, (err, numOfUpdatedRecord) => {
                    if (err) throw `it seems there's a problem while editing the record`
                    else {
                        if (callback) callback();
                        Swal.fire(`${numOfUpdatedRecord} Buku diedit: ${formData.judul}`)
                        gotoPage(get(lastPage));
                    }
                })
            }
        });
    } else {
        Swal.fire("Judul wajib diisi");
    }
}

export function deleteBook(bookData) {
    Swal.fire({
        title: "Hapus buku ini?",
        text: `anda akan menghapus buku,  "${bookData.judul}",         
        Data tak dapat dikembalikan`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Hapus buku",
    }).then((result) => {
        if (result.isConfirmed) {
            collection.remove({ _id: bookData._id }, (err, numOfDeletedBook) => {
                if (err) throw `'Strangely we couldn't find the book that will be deleted`
                else {
                    gotoPage(get(lastPage))
                    Swal.fire(`${numOfDeletedBook} Buku dihapus: ${bookData.judul}`)
                }
            })
        }
    });
}

//lending with promises

//promisifying

const updateBook = function (updateSelector, updateQuery) {
    return new Promise(function (resolve, reject) {
        collection.update(updateSelector, updateQuery, (err, numOfUpdate, opStatus) => {
            if (err) reject(err)
            else resolve({ numOfUpdate, opStatus })
        })
    })
}

const newLendingEntry = function (lendData) {
    return new Promise(function (resolve, reject) {
        lendings.insert(lendData, (err, result) => {
            if (err) reject(err)
            else resolve(result)
        })
    })
}

const newBorrowerEntry = function (borrowerData) {
    return new Promise(function (resolve, reject) {
        borrowers.insert(borrowerData, (err, result) => {
            if (err) reject(err)
            else resolve(result)
        })
    })
}

//when the utility node.promisify didn't work
function promisify(fun) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fun.apply(fun, [].concat(args, (err, res) => (err) ? reject(err) : resolve(res)))
        })
    }
}

export function lendBook(data, callback) {
    let borrower_id = new Date().getTime()
    let statusPinjam = new Date().getTime() //lending _id

    let updateSelector = { _id: data._id }
    let updateQuery = {
        $set: {
            statusPinjam,
            modifiedAt: new Date()
        }
    }

    let lendingQuery = {
        _id: statusPinjam,
        book_id: data._id,
        borrower_id,
        tanggalPinjam: data.tanggalPinjam,
        tanggalKembali: data.tanggalKembali
    }
    let borrowerQuery = { _id: borrower_id, namaPeminjam: data.namaPeminjam, alamatPeminjam: data.alamatPeminjam }
    updateBook(updateSelector, updateQuery)
        .then((_) => newBorrowerEntry(borrowerQuery))
        .then((_) => newLendingEntry(lendingQuery))
        .then(_ => gotoPage())
        .catch((err) => {
            console.log(err)
            console.log(`deleting as necessary because of error `)
            collection.update(updateQuery, { $set: { statusPinjam: null } })
            lendings.remove({ _id: statusPinjam })
            borrowers.remove({ _id: borrower_id })
        })



    if (callback) callback()
}

export function getLendingData(statusPinjam) {
    return new Promise((resolve, reject) => {
        //search by lending id
        lendings.findOne({ _id: statusPinjam }, (err, lendingData) => {
            if (err) reject(err)
            else {
                borrowers.findOne({ _id: lendingData.borrower_id }, (er, borrowerData) => {
                    if (er) reject(er)
                    else {
                        console.log(`printing out getLendingData`, lendingData, borrowerData)
                        resolve({ lendingData, borrowerData })
                    }
                })
            }
        })
    })
}

export function editLending(data, callback) {
    lendings.update({ _id: data.statusPinjam }, { $set: { tanggalKembali: data.tanggalKembali, tanggalPinjam: data.tanggalPinjam } }, (err, numOfUpdatedRecord) => {
        if (err) throw 'cannot update lendings data, check database codes'
        else borrowers.update({ _id: data.borrower_id }, { $set: { namaPeminjam: data.namaPeminjam, alamatPeminjam: data.alamatPeminjam } }, (er, numOfUpdatedRecord) => {
            if (er) throw 'cannot update borrwings data, check database codes'
            else {
                console.log('update lending data success')
                gotoPage()
            }
        })
    })
}
export function returnBook(book_id) {
    updateBook({ _id: book_id }, { $set: { statusPinjam: null } })
        .then(_ => { console.log(_); gotoPage() })
}