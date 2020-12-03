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

  export let formLendingData = {};
  export let editMode = false;
  export let formTitle;
  export let activateLendingDialog = false;

  function pinjamBuku() {
    if (!formLendingData.namaPeminjam) {
      Swal.fire("nama peminjam wajib diisi");
    } else {
      lendBook(formLendingData, closeDialog);
    }
  }

  

  function closeDialog() {
    activateLendingDialog = false;
    formLendingData = {};
    editMode = false;
    activateLendingDialog = false;
    dispatch("lendingdialogclosed");
  }

  export function initiateEditData() {
    
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
          <TextField outlined bind:value={formLendingData.namaPeminjam}>
            Nama Peminjam
          </TextField>
          <span class="text-caption text-black">&nbsp Nama Peminjam Harus diisi</span>
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
              {#if formLendingData.tanggalPinjam && editMode}
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
              {#if formLendingData.tanggalKembali && editMode}
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
        <Button on:click={editLending} text>
          Edit Data Peminjaman
        </Button>
      {:else}
        <Button on:click={pinjamBuku} text>Pinjamkan Buku</Button>
      {/if}
      <Button on:click={closeDialog} text class="red-text">Close</Button>
    </CardActions>
  </Card>
</Dialog>
