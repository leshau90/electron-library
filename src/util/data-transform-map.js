const moment = require('moment');
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export const columnHeaderFormater = {
  _id: 'id',
  judul: 'Judul',
  pengarang: 'Pengarang',
  edisi: "Edisi",
  cetakan: "Cetakan",
  penerbit: "Penerbit",
  lokasiPenerbit: "Lokasi Penerbit",
  tahunTerbit: 'Tahun Terbit',
  isbn: "ISBN",
  kategori: "Kategori",
  rak: "Rak",
  tanggalBeli: "Tanggal Beli",
  hargaBeli: "Harga Beli"
  // statusPinjam: "Status Pinjam",
  // tanggalPinjam: "Tanggal Pinjam"
}

const besarKecil = [{ name: 'Terbesar ke Terkecil', value: 'Terbesar ke Terkecil', queryVal: -1 }, { name: 'Terkecil ke Terbesar', value: 'Terkecil ke Terbesar', queryVal: 1 }]
const zToa = [{ name: 'Z-A', value: 'Z-A', queryVal: -1 }, { name: 'A-Z', value: 'A-Z', queryVal: 1 }]
const awalAkhir = [{ name: 'Terakhir ke Paling Awal', value: 'Terakhir ke Paling Awal', queryVal: -1 }, { name: 'Paling Awal ke Terakhir', value: 'Paling Awal ke Terakhir', queryVal: 1 }]

export const sorterNameToValues = {
  'id': { key: '_id', options: besarKecil },
  'Judul': { key: 'judul', options: zToa },
  'Pengarang': { key: 'pengarang', options: zToa },
  "Edisi": { key: 'edisi', options: besarKecil },
  "Cetakan": { key: 'cetakan', options: besarKecil },
  "Penerbit": { key: 'penerbit', options: zToa },
  "Lokasi Penerbit": { key: 'lokasiPenerbit', options: zToa },
  'Tahun Terbit': { key: 'tahunTerbit', options: awalAkhir },
  "ISBN": { key: 'isbn', options: zToa },
  "Rak": { key: 'rak', options: zToa },
  "Tanggal Beli": { key: 'tanggalBeli', options: awalAkhir },
  "Harga Beli": { key: 'hargaBeli', options: besarKecil }
}

export const columnDataFormater = {
  _id: x => x,
  judul: (x) => x,
  pengarang: (x) => x,
  edisi: (x) => x ? `ke ${x}` : "",
  cetakan: (x) => x ? `ke ${x}` : "",
  penerbit: (x) => x,
  lokasiPenerbit: (x) => toTitleCase(x),
  tahunTerbit: (x) => x ? moment(x).format('YYYY') : '',
  isbn: (x) => x,
  kategori: (x) => x,
  rak: (x) => x || "",
  tanggalBeli: (x) => x ? moment(x).format('DD-MMMM-YYYY') : '',
  hargaBeli: (x) => `Rp ${x}`,
  // statusPinjam: (x) => x ? 'yes' : 'no',
  // tanggalPinjam: (x) => x ? moment(x).format('DD-MMMM-YYYY') : ''
}

//default is 5% else 10% using HTML 5 col element
export const defaultWidthColumn = {
  judul: `16%`,
  pengarang: `8%`,
  penerbit: `8%`,
  isbn: `8%`,
  kategori: `8%`,
  hargaBeli: `8%`,
  tanggalBeli: `8%`,
  tanggalPinjam: "8%",
  _id: "4%"
}

