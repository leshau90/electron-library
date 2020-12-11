import { writable, get } from 'svelte/store';
import { columnHeaderFormater } from "./util/data-transform-map";
import { collection, borrowers, lendings } from "./util/db-connector";
import Swal from 'sweetalert2';
import { compute_rest_props, insert } from 'svelte/internal';


let defaultColumns = Object.keys(columnHeaderFormater)
//if else routing
export const VIEW = Object.freeze({
    HOME: 1,
    BOOKLIST: 2,
    LENDINGS: 3,
    BORRWERS: 4,
});
export let currentView = writable(VIEW.BOOKLIST);


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
    console.log('gotoPage with this Sorter and query ', sorterY, get(query))
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
// const emptyPromise = () => new Promise((resolve, reject) => resolve('empty'))

export function loadLendingData(id) {
    console.log('finding in lendings where book id is', id)
    return new Promise((resolve, reject) => {
        let completeLendingData = []
        lendings.find({ book_id: id }).toArray((err, peminjaman) => {
            if (err) reject('error while loading lending data --loadLendingData')
            else {
                let arrayOfBorrowerId = peminjaman.map(x => x.borrower_id)
                if (arrayOfBorrowerId.length < 1) {
                    console.log('no need to search because of no borrower yet')
                    resolve(null)
                    return
                }
                console.log('now loading the associated names from borrowers ids:', arrayOfBorrowerId)
                peminjaman.map(pinjam => {
                    borrowers.find({ _id: { $in: arrayOfBorrowerId } }).toArray((err, arrayOfBorrowers) => {
                        if (err) reject('error while getting the borrwer data for this cluster of borrowerId' + arrayOfBorrowerId)
                        else {
                            console.log('transforming the returned data by crossreferencing id and borrowers, borrower array', arrayOfBorrowers)
                            completeLendingData = peminjaman.map(pinjam => {

                                let r = arrayOfBorrowers.find(b => b._id == pinjam.borrower_id)
                                pinjam.namaPeminjam = r.namaPeminjam
                                pinjam.alamatPeminjam = r.alamatPeminjam
                                return pinjam
                            })
                            console.log(completeLendingData)
                            // completeLendingData.sort()
                            resolve(completeLendingData)
                        }
                    })
                })
            }
        })
    })
}

export function lendBook(data, callback) {
    // console.log(data.borrower_id ? 'suggested borrower id is set, inserting lending immediately' : 'no borrower id new borrower and lending it is')

    let borrower_id = data.borrower_id || new Date().getTime()
    let statusPinjam = new Date().getTime() //lending _id
    let insertOnlyLending = data.borrower_id ? true : false


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
        .then((_) => {
            if (insertOnlyLending) Promise.resolve(null);
            else newBorrowerEntry(borrowerQuery)
        })
        .then((_) => newLendingEntry(lendingQuery))
        .then(_ => {
            gotoPage();
            if (callback) callback()
        })
        .catch((err) => {
            console.log(err)
            console.log(`deleting as necessary because of error `)
            collection.update(updateQuery, { $set: { statusPinjam: null } })
            lendings.remove({ _id: statusPinjam })
            if (!insertOnlyLending) borrowers.remove({ _id: borrower_id })
        })
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
                if (callback) callback()
                gotoPage()
            }
        })
    })
}
export function returnBook(book_id, judul, statusPinjam) {
    Swal.fire({
        title: 'Pengembalian Buku',
        showDenyButton: true,
        showCancelButton: true,
        text: 'Set tanggal pengembalian ke hari ini?',
        denyButtonColor: "#3085d6",
        denyButtonText: `Kembalikan`,
        confirmButtonColor: '#2845d4',
        confirmButtonText: `Set Tanggal, lalu Kembalikan`,
        width: '400px',
        icon: 'question'
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            lendings.update({ _id: statusPinjam }, { $set: { tanggalKembali: new Date() } }, (err, result) => {
                if (err) throw 'cannot set tanggalKembali'
            })
        }
        if (result.isConfirmed || result.isDenied) {
            updateBook({ _id: book_id }, { $set: { statusPinjam: null } })
                .then((result) => {
                    console.log('--returnBook hasil pengembalian', result)
                    Swal.fire('Buku Dikembalikan', ` buku ${judul} dikembalikan`, 'info');
                    gotoPage()
                }).catch(console.log)
        }
    })


}

export function searchBorrowerName(name) {
    // console.log('store: searchBorrowerName',name)

    let reg = new RegExp(name, 'i')
    return new Promise((resolve, reject) => {
        if (!name || name == undefined) resolve([])
        borrowers.find({ namaPeminjam: reg }).toArray((err, resultArray) => {
            if (err) reject(err)
            else {
                // console.log('store: searchBorrower by name, resulting array', resultArray)
                resolve(resultArray)
            }
        })
    })
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
