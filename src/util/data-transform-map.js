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
  isbn: `ISBN`,
  kategori: "Kategori",
  rak: "Rak",
  tanggalBeli: "Tanggal Beli",
  hargaBeli: "Harga Beli"
  // statusPinjam: "Status Pinjam",
  // tanggalPinjam: "Tanggal Pinjam"
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

