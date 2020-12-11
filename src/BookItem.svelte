<script>
  const moment = require("moment");
  import DataPeminjaman from "./DataPeminjaman.svelte";
  import {
    getLendingData,
    recordPerPage,
    lastPage,
    deleteBook,
    returnBook,
  } from "./store";
  import { slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import Swal from "sweetalert2";
  const dispatch = createEventDispatcher();
  import {
    mdiDatabaseEdit,
    mdiHandshake,
    mdiHandshakeOutline,
    mdiInformationOutline,
    mdiTrashCanOutline,
  } from "@mdi/js";

  import {
    Menu,
    List,
    Tooltip,
    Chip,
    Button,
    CardText,
    Card,
    Divider,
    Row,
    Col,
    Icon,
    ListItem,
  } from "svelte-materialify/src";
  import { query, gotoPage } from "./store";

  export let item = {};
  let detailed = false;
  function toggleDetail() {
    detailed = !detailed;
  }

  function listBookByKategori(selectedCategory) {
    Swal.fire({
      title: "Cari Berdasarkan Kategori",
      text: `tampilkan semua buku dengan kategori, ${selectedCategory}? atau yang sebaliknya...`,
      showCancelButton: true,
      showDenyButton: true,
      denyButtonText: "Tampilkan Sebaliknya",
      confirmButtonText: `Ya`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        $query = { kategori: { $in: [selectedCategory] } };
        gotoPage();
        Swal.fire('Pencarian',`menampilkan buku dengan kategori: ${selectedCategory}`,'info')
      } else if (result.isDenied) {
        $query = { kategori: { $nin: [selectedCategory] } };
        gotoPage();
        Swal.fire('Pencarian',`menampilkan buku yang bukan kategori: ${selectedCategory}`,'info')
      } else return;
    });
  }
  function callReturnBook() {
    returnBook(item._id, item.judul, item.statusPinjam);
  }
  export let number = 0;

  function callEditBookDialog() {
    dispatch("editbook", {
      data: item,
    });
  }

  function callEditLendingBookDialog() {
    let data = {
      _id: item._id,
      judul: item.judul,
      statusPinjam: item.statusPinjam,
    };
    getLendingData(data.statusPinjam)
      .then(({ lendingData, borrowerData }) => {
        data.borrower_id = borrowerData._id;
        data.tanggalKembali = lendingData.tanggalKembali;
        data.tanggalPinjam = lendingData.tanggalPinjam;
        data.alamatPeminjam = borrowerData.alamatPeminjam;
        data.namaPeminjam = borrowerData.namaPeminjam;

        console.log("BOOKITEM event data", data);
        dispatch("editbooklending", { data });
      })
      .catch((err) => console.log(err));
  }

  function callLendBookDialog() {
    dispatch("lendbook", {
      data: {
        _id: item._id,
        judul: item.judul,
      },
    });
  }

  // let node;
  // $:{console.log(node?node.getBoundingClientRect():`undefined`)}
</script>

<style>
  .borrowed {
    background-color: grey;
  }
</style>

<div>
  <Divider />
  <Card flat class="ml-4">
    <Row>
      <Col class="" cols="12">
        {#if detailed}
          <div>
            <Row>
              <Col class="pa-2" cols="6">
                <span class="text--secondary "> #{item._id} <br /> </span>
              </Col>
              <Col class="pa-2" cols="6">
                <span class="text-caption"> rak: {item.rak || '-'} </span>
              </Col>
            </Row>
          </div>
        {/if}
      </Col>

      <Col cols="12">
        <div>
          <p>
            <span
              class="text-comment">{1 + (number + ($lastPage - 1) * $recordPerPage)}:
            </span>
            <span
              class="text-h6"
              on:click={toggleDetail}
              class:grey={item.statusPinjam != null}>{item.judul}
            </span>
          </p>
          <Tooltip bottom>
            <Button icon size="medium" on:click={toggleDetail}>
              <Icon class="blue-text" path={mdiInformationOutline} />
            </Button>
            <span slot="tip">Info Detail</span>
          </Tooltip>
          <Tooltip bottom>
            <Button icon size="medium" on:click={() => deleteBook(item)}>
              <Icon class="red-text" path={mdiTrashCanOutline} />
            </Button>
            <span slot="tip">Hapus buku</span>
          </Tooltip>
          <Tooltip bottom>
            <Button icon size="medium" on:click={callEditBookDialog}>
              <Icon class="blue-text" path={mdiDatabaseEdit} />
            </Button>
            <span slot="tip">Edit Buku</span>
          </Tooltip>

          {#if item.statusPinjam}
            <Menu>
              <div slot="activator">
                <Tooltip bottom>
                  <Button icon size="medium">
                    <Icon class="blue-text" path={mdiHandshake} />
                  </Button>
                  <span slot="tip">Kembalikan/edit peminjaman</span>
                </Tooltip>
              </div>
              <List>
                <ListItem on:click={callEditLendingBookDialog}>
                  Edit Data Peminjaman
                </ListItem>
                <ListItem on:click={callReturnBook}>Kembalikan Buku</ListItem>
              </List>
            </Menu>
          {:else}
            <Tooltip bottom>
              <Button icon size="medium" on:click={callLendBookDialog}>
                <Icon class="green-text" path={mdiHandshakeOutline} />
              </Button>
              <span slot="tip">Pinjamkan Buku</span>
            </Tooltip>
          {/if}
        </div>
        {#if detailed}
          <div >
            <Row>
              <Col cols="6">
                <CardText>
                  <span class="text-body-1"> Info Penerbitan </span>
                  <Divider />
                  Pengarang:
                  {item.pengarang || '-'}
                  <Divider />
                  penerbit:
                  {item.penerbit || '-'}
                  <Divider />
                  tahun:
                  {item.tahunTerbit || '-'}
                  <Divider />
                  di:
                  {item.lokasiPenerbit || '-'}
                  <Divider />
                  edisi ke
                  {item.edisi || '-'}
                  <Divider />
                  cetakan ke
                  {item.cetakan || '-'}
                  <Divider />
                  <span class="text-caption"> isbn: {item.isbn || '-'} </span>
                </CardText>
              </Col>
              <Col cols="6">
                <CardText>
                  <span class="text-body-1"> Info Pembelian </span>
                  <Divider />
                  tanggal:
                  {item.tanggalBeli ? moment(item.tanggalBeli).format('DD-MMMM-YYYY') : '-'}
                  <Divider />
                  harga:
                  {item.hargaBeli || '-'}
                </CardText>
              </Col>
              <Col cols="6">
                <CardText>
                  <span class="text-body-1"> Kategori: </span>
                  {#if item.kategori.length == 0}
                    <span class="text-caption"> Belum ada kategori </span>
                  {/if}
                  <div class="d-flex flex-wrap justify-center mb-1">
                    {#each item.kategori as k}
                      <Chip class="ma-1" on:click={() => listBookByKategori(k)}>
                        {k}
                      </Chip>
                    {/each}
                  </div>
                </CardText>
              </Col>
              <DataPeminjaman id={item._id} statusPinjam={item.statusPinjam} />
            </Row>
          </div>
        {/if}
      </Col>
    </Row>
  </Card>
</div>

<!-- _id: 'id',
  judul: 'Judul',
  pengarang: 'Pengarang',
  edisi: "Edisi",
  cetakan: "Cetakan",
  penerbit: "Penerbit",
  lokasiPenerbit: "Lokasi Penerbit",
  tahunTerbit: 'Tahun Terbit',
  isbn: `     ISBN     `,
  kategori: "Kategori",
  rak: "Rak",
  tanggalBeli: "Tanggal Beli",
  hargaBeli: "Harga Beli",
  statusPinjam: "Status Pinjam",
  tanggalPinjam: "Tanggal Pinjam" -->
