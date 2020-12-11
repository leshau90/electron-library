<script>
  const moment = require("moment");

  import {
    Button,
    Dialog,
    Card,
    CardTitle,
    Chip,
    Divider,
    Select,
    CardText,
    CardActions,
    TextField,
    Row,
    Col,
  } from "svelte-materialify/src";

  import { createEventDispatcher, onMount } from "svelte";
  const dispatch = createEventDispatcher();
  import { gotoPage, query, sorter } from "./store";
  import NumberSearchDetailed from "./NumberSearchDetailed.svelte";
  import SortingCriteriaList from "./SortingCriteriaList.svelte";
  // import Menu from "svelte-materialify/src/components/Menu";

  export let showAdvSearchDialog = false;
  let advSearch = {};
  let tempSorter = {...$sorter};
  function closeDialog() {
    showAdvSearchDialog = false;
    advSearch = {};
    dispatch("advDialogClosed");
  }

  function doAdvSearch() {
    $query = {};
    Object.keys(advSearch).forEach((key) => {
      if (advSearch[key]) {
        $query[key] = advSearch[key];
      }
    });

    $sorter = tempSorter
    gotoPage();
    closeDialog();
  }

  export function fillFirst() {
    advSearch = { ...$query };
  }

  //kategori codes
  let newKategori = [];
  let inputKategori;
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
    setQueryForKategori();
  }

  function deleteInputKategori(k) {
    newKategori = newKategori.filter((x) => x !== k);
    inputKategori = newKategori.join(", ");
    setQueryForKategori();
  }

  function setQueryForKategori() {
    console.log(
      `kategori selector query edit, with newKategori.length is ${newKategori.length} `
    );
    if (newKategori.length > 0) {
      advSearch.kategori = { $all: newKategori };
    } else {
      delete advSearch.kategori;
      console.log("after deleting", advSearch);
    }
  }
</script>

<Dialog fullscreen bind:active={showAdvSearchDialog}>
  <Card>
    <CardText>
      <Row>
        <Col cols="12"><span class="text-h4">Kriteria Pencarian</span></Col>
        <Col cols="12">
          <TextField dense outlined bind:value={advSearch.judul}>
            judul
          </TextField>
        </Col>
        <Col cols="12">
          <TextField dense outlined bind:value={advSearch.pengarang}>
            Pengarang
          </TextField>
        </Col>
        <Col cols="6">
          <TextField dense outlined bind:value={advSearch._id}>id</TextField>
        </Col>
        <Col cols="6">
          <TextField dense outlined bind:value={advSearch.rak}>rak</TextField>
        </Col>
        <Col cols="6">
          <TextField dense outlined bind:value={advSearch.isbn}>ISBN</TextField>
        </Col>
        <Col cols="6">
          <TextField dense outlined bind:value={advSearch.lokasiPenerbit}>
            Kota Penerbit
          </TextField>
        </Col>
        <Col cols="12">
          <NumberSearchDetailed
            bind:numberFormData={advSearch.tahunTerbit}
            title="Tahun Terbit" />
        </Col>
        <Col cols="12">
          <NumberSearchDetailed
            bind:numberFormData={advSearch.edisi}
            title="Edisi" />
        </Col>

        <Col cols="12">
          <NumberSearchDetailed
            bind:numberFormData={advSearch.cetakan}
            title="Cetakan" />
        </Col>
        <Col cols="12">
          <Divider />
        </Col>
        <Col cols="12">
          <NumberSearchDetailed
            bind:numberFormData={advSearch.hargaBeli}
            title="Harga" />
        </Col>
        <Col cols="12">
          <NumberSearchDetailed
            bind:numberFormData={advSearch.tanggalBeli}
            title="Tanggal Beli"
            inputType="date" />
        </Col>
        <Col cols="6">
          <span class="text-caption"> {JSON.stringify(advSearch)} </span>
        </Col>
        <Col cols="12">
          <Divider />
        </Col>
        <Col cols="12">
          <div class="d-flex flex-wrap justify-center mb-1">
            {#each newKategori as nk (nk)}
              <Chip
                close
                class="ma-1 teal white-text"
                on:close={() => deleteInputKategori(nk)}>
                {nk}
              </Chip>
            {/each}
          </div>
          <TextField on:input={addKategori} outlined bind:value={inputKategori}>
            Kategori
          </TextField>
        </Col>
        <Col cols="12">
          <span class="text-h4 mb-2"><Divider /></span>
        </Col>
        <Col cols="12"><span class="text-h4">Kriteria Pengurutan</span></Col>
        <Col cols="12"><span class="text-caption">{JSON.stringify(tempSorter)}</span></Col>
        <SortingCriteriaList bind:sortingItems={tempSorter} />
      </Row>
    </CardText>
    <CardActions class="justify-end">
      <Button on:click={doAdvSearch} text>Cari dan Urutkan</Button>
      <Button on:click={closeDialog} text class="red-text">Close</Button>
    </CardActions>
  </Card>
</Dialog>
