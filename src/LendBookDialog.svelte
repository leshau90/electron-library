<script>
  const moment = require("moment");

  import {
    Button,
    Dialog,
    Card,
    CardTitle,
    CardText,
    CardActions,
    TextField,
    Row,
    Col,
  } from "svelte-materialify/src";
  import Divider from "svelte-materialify/src/components/Divider";

  import { createEventDispatcher, onMount } from "svelte";
  const dispatch = createEventDispatcher();
  import { lendBook, editLending } from "./store";
  import Swal from "sweetalert2";
  // import Menu from "svelte-materialify/src/components/Menu";
  import AutoCompleteBorrowerName from "./AutoCompleteBorrowerName.svelte";

  export let formLendingData = {};
  export let editMode = false;
  export let formTitle;
  export let activateLendingDialog = false;

  function editLendingData(){
    if (!validateForm()) {
      return;
    } else {
      editLending(formLendingData,closeDialog)
    }
  }
  function pinjamBuku() {
    if (!validateForm()) {
      return;
    } else {
      lendBook(formLendingData, closeDialog);
    }
  }

  function setBasedOnSuggestedBorrower(evt) {
    console.log(evt.detail);
    formLendingData.alamatPeminjam = evt.detail.alamatPeminjam;
    formLendingData.borrower_id = evt.detail._id;
  }

  function closeDialog() {
    activateLendingDialog = false;
    formLendingData = {};
    editMode = false;
    activateLendingDialog = false;
    dispatch("lendingdialogclosed");
  }

  function validateForm() {
    if (!formLendingData.namaPeminjam) {
      Swal.fire("Periksa Input", "nama peminjam wajib diisi", "warning");
      return false;
    }

    let pinjam = moment(formLendingData.tanggalPinjam)
    let kembali = moment(formLendingData.tanggalKembali)
    console.log("VALIDATING FORM pinjam dan kembali", pinjam, kembali);
    if (!isNaN(moment) && !isNaN(kembali)) {
      if (kembali.isBefore(pinjam)) {
        Swal.fire(
          "Periksa Input",
          "pastikan tanggal kembali tidak mendahului tanggal pinjam",
          "warning"
        );
        return false;
      }
    }
    console.log("Data seems valid..committing",formLendingData);
    return true;
  }
  
</script>

<Dialog fullscreen bind:active={activateLendingDialog}>
  <Card>
    <CardTitle>
      <h4>{formTitle}</h4>
    </CardTitle>
    <CardText>
      <Row>
        <Col cols="12">
          <p class="text-comment text-black">
            Judul Buku:&nbsp
            {formLendingData.judul}
          </p>
          <p class="text-caption text-black">id:&nbsp{formLendingData._id}</p>
        </Col>
        <Col cols="12">
          <AutoCompleteBorrowerName
            {editMode}
            bind:textInput={formLendingData.namaPeminjam}
            on:suggested={setBasedOnSuggestedBorrower} />
        </Col>
        <Col cols="12">
          <TextField outlined bind:value={formLendingData.alamatPeminjam}>
            Alamat Peminjam
          </TextField>
        </Col>
        <Col cols="12">
          <Divider />
        </Col>
        <Col cols="6">
          <Row>
            <Col cols="12">
              {#if (() => formLendingData.tanggalPinjam)() && editMode}
                <p class="text-comment">
                  Tanggal Pinjam
                  <span class="text-caption">(dalam database)</span>
                  :
                  {moment((() => formLendingData.tanggalPinjam)()).format('DD/MM/YYYY')}
                </p>
              {/if}
              <TextField
                outlined
                placeholder=" "
                type="date"
                bind:value={formLendingData.tanggalPinjam}>
                Tanggal Pinjam
                {#if formLendingData.tanggalPinjam && editMode}Baru{/if}
              </TextField>
            </Col>
          </Row>
        </Col>
        <Col cols="6">
          <Row>
            <Col cols="12">
              {#if (() => formLendingData.tanggalKembali)() && editMode}
                <p class="text-comment">
                  Tanggal Kembali
                  <span class="text-caption">(dalam database)</span>
                  :
                  {moment((() => formLendingData.tanggalKembali)()).format('DD/MM/YYYY')}
                </p>
              {/if}
              <TextField
                outlined
                placeholder=" "
                type="date"
                bind:value={formLendingData.tanggalKembali}>
                Tanggal Kembali
                {#if formLendingData.tanggalKembali && editMode}Baru{/if}
              </TextField>
            </Col>
          </Row>
        </Col>
        <Col cols="12">{JSON.stringify(formLendingData)}</Col>
      </Row>
    </CardText>
    <CardActions class="justify-end">
      {#if editMode}
        <Button on:click={editLendingData} text>Edit Data Peminjaman</Button>
      {:else}
        <Button on:click={pinjamBuku} text>Pinjamkan Buku</Button>
      {/if}
      <Button on:click={closeDialog} text class="red-text">Close</Button>
    </CardActions>
  </Card>
</Dialog>
