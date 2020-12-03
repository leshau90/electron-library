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
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import { editBook, saveNew } from "./store";
  import Chip from "svelte-materialify/src/components/Chip";

  export let formData = { kategori: [] };

  let inputKategori;
  export let editMode = false;
  function deleteInputKategori(k) {
    newKategori = newKategori.filter((x) => x !== k);
    inputKategori = newKategori.join(", ");
  }

  function closeDialog() {
    inputKategori = '';
    newKategori = []
  

    formData = { kategori: [] };
    activateDialog = false;
    editMode = false;
    
    dispatch("bookDataDialogClosed");
  }

  let newKategori = [];
  
  function addKategori() {
    newKategori = Array.from(
      new Set(
        inputKategori
          .toLowerCase()
          .split(",")
          .map((x) => {
            return x.trim();
          })
      )
    );
  }
  export let formTitle;
  export let activateDialog = false;
</script>

<style>
  .zzz {
    z-index: 20;
  }
</style>

<Dialog fullscreen bind:active={activateDialog}>
  <div class="zzz">
    <Card dense>
      <CardTitle>
        <h4>{formTitle}</h4>
      </CardTitle>
      <CardText>
        <Row>
          <Col cols="12">
            <TextField outlined bind:value={formData.judul}>Judul*</TextField>
          </Col>
          <Col cols="12">
            <span class="text-caption text-black">judul harus diisi</span>
          </Col>
          <Col cols="6">
            <Row>
              <Col cols="12">
                <TextField outlined bind:value={formData.pengarang}>
                  Pengarang
                </TextField>
              </Col>
              <Col cols="12">
                <TextField outlined bind:value={formData.penerbit}>
                  Penerbit
                </TextField>
              </Col>
              <Col cols="12">
                <TextField outlined bind:value={formData.lokasiPenerbit}>
                  Lokasi Penerbit
                </TextField>
              </Col>
              <Col cols="12">
                <TextField
                  outlined
                  type="number"
                  bind:value={formData.tahunTerbit}>
                  Tahun Terbit
                </TextField>
              </Col>
              <Col cols="12">
                <TextField
                  outlined
                  min="1"
                  type="number"
                  bind:value={formData.edisi}>
                  Edisi:
                </TextField>
              </Col>
              <Col cols="12">
                <TextField
                  outlined
                  min="1"
                  type="number"
                  bind:value={formData.cetakan}>
                  Cetakan
                </TextField>
              </Col>
              <Col cols="12">
                <TextField outlined bind:value={formData.isbn}>ISBN</TextField>
              </Col>
            </Row>
          </Col>
          <Col cols="6">
            <Row>
              <Col cols="12">
                {#if formData.tanggalBeli && editMode}
                  <p class="text-comment">
                    Tanggal Beli
                    <span class="text-caption">(dalam database)</span>
                    :
                    {moment((()=>formData.tanggalBeli)()).format('DD/MM/YYYY')}
                  </p>
                {/if}
                <TextField
                  outlined
                  placeholder=" "
                  type="date"
                  bind:value={formData.tanggalBeli}>
                  Tanggal Beli
                  {#if formData.tanggalBeli}Baru{/if}
                </TextField>
                <!-- <input
                  type="date"
                  bind:value={formData.tanggalBeli}
                  class="dateInput" /> -->
                <!-- <Datepicker bind:selected={formData.tanggalBeli} start={new Date(1900, 1, 1)} format={date => moment(date).format('DD-MMMM-YYYY')} /> -->
              </Col>
              <Col cols="12">
                <TextField
                  outlined
                  type="number"
                  bind:value={formData.hargaBeli}>
                  Harga
                </TextField>
              </Col>
              <Col cols="12">
                <Divider />
              </Col>
              <Col cols="12">
                <TextField outlined bind:value={formData.rak}>Rak</TextField>
              </Col>
              <Col cols="12">
                <Divider />
              </Col>
              <Col cols="12">
                <div class="d-flex flex-wrap justify-center mb-1">
                  {#each formData.kategori as k}
                    <Chip
                      close
                      class="ma-1 blue white-text"
                      on:close={() => {
                        formData.kategori = formData.kategori.filter((x) => x !== k);
                      }}>
                      {k}
                    </Chip>
                  {/each}
                  {#each newKategori as nk (nk)}
                    <Chip
                      close
                      class="ma-1 teal white-text"
                      on:close={() => deleteInputKategori(nk)}>
                      {nk}
                    </Chip>
                  {/each}
                </div>
                <TextField
                  on:input={addKategori}
                  outlined
                  bind:value={inputKategori}>
                  Kategori
                </TextField>
              </Col>
            </Row>
          </Col>
          <!-- <Col cols="12">{JSON.stringify(formData, 0, 1)}</Col>
          <Col cols="12">{JSON.stringify(newKategori, 0, 1)}</Col> -->
        </Row>
      </CardText>
      <CardActions class="justify-end">
        {#if editMode}
          <Button
            on:click={() => editBook(formData, newKategori, closeDialog)}
            text>
            Edit Buku
          </Button>
        {:else}
          <Button
            on:click={() => saveNew(formData, newKategori, closeDialog)}
            text>
            Simpan Buku Baru
          </Button>
        {/if}
        <Button on:click={closeDialog} text class="red-text">Close</Button>
      </CardActions>
    </Card>
  </div>
</Dialog>
