<script>
  import { mdiMagnify } from "@mdi/js";
  import Swal from "sweetalert2";
  import { query, sorter, gotoPage } from "./store";
  import { createEventDispatcher, onMount } from "svelte";
  const dispatch = createEventDispatcher();
  import { columnHeaderFormater as fields } from "./util/data-transform-map";
  import {
    Menu,
    Button,
    List,
    ListItem,
    Tooltip,
    Icon,
  } from "svelte-materialify/src";

  function defaultQuery() {
    $query = {};
    gotoPage();
  }

  function callAdvSeachDialog() {
    dispatch('showAdvSearchDialog')
  }

  function newSearch() {
    let newQuery = "";
    Swal.fire({
      title: "Pencarian",
      text: "pilih dasar pencarian",
      input: "select",
      inputOptions: fields,
      inputPlaceholder: "field",
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: `Apa ${fields[result.value]} yang dicari?`,
          input: "text",
          inputPlaceholder: "kata kunci",
          showCancelButton: true,
        }).then((kataKunci) => {
          if (kataKunci) {
            //transforming it into query json
            if (result.value === "kategori")
              $query = {
                [result.value]: { $in: [kataKunci.value.toLowerCase()] },
              };
            else {
              let r = new RegExp(kataKunci.value, "i");
              $query = { [result.value]: r };
            }
            console.log("New query", $query);
            gotoPage();
          }
        });
      }
    });
  }

  
</script>

<style>
  /* @import "svelte-materialify/src/styles/tools/colors";

  .searchbox {
    color:white;
    background-color: material-color("white");
        
  } */
</style>

<div class="mr-3 mt-1 mb-1 pa-1 ">
  <Menu>
    <div slot="activator">
      <Tooltip bottom>
        <Button icon>
          <Icon path={mdiMagnify} />
        </Button>
        <span slot="tip">pencarian</span>
      </Tooltip>
    </div>
    <List>
      <ListItem on:click={defaultQuery}>Hapus Pencarian</ListItem>
      <ListItem on:click={newSearch}>Cari Berdasarkan...</ListItem>
      <ListItem on:click={callAdvSeachDialog}>Pencarian Lebih Detail</ListItem>
    </List>
  </Menu>
</div>
