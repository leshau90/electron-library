<script>
  import { mdiSort } from "@mdi/js";
  import Swal from "sweetalert2";
  import { sorter, gotoPage } from "./store";
  import { columnHeaderFormater as criterion } from "./util/data-transform-map";
  import {
    Menu,
    Button,
    List,
    ListItem,
    Tooltip,
    Icon,
  } from "svelte-materialify/src";

  function defaultSort() {
    $sorter = { _id: -1 };
    gotoPage();
  }

  function sortBy(criteria, add) {
    if (add) Object.assign($sorter, criteria);
    else $sorter = criteria;
    gotoPage();
  }

  function newSortCriteria() {
    let newSorter = "";
    Swal.fire({
      title: "Pengurutan",
      text: "pilih kriteria pengurutan",
      input: "select",
      inputOptions: criterion,
      inputPlaceholder: "kriteria",
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        newSorter = result.value;
        Swal.fire({
          title: "Arah Pengurutan",
          input: "select",
          inputOptions: {
            "1": "Terkecil sampai Terbesar",
            "-1": "Terbesar sampai terkecil",
          },
          inputPlaceholder: "arah",          
        }).then((arah) => {
          newSorter = { [newSorter]: parseInt(arah.value) };
          sortBy(newSorter, false);
        });
      }
    });

    // Swal.fire({
    //   title: "pilih kriteria pengurutan",
    //   text: "Urut data berdasarkan...?",
    //   inputOptions:{
    //       '_id':'id'
    //   } ,
    //   inputPlaceholder: "kriteria",
    //   showCancelButton: "true",
    // });
  }
//   console.log("column names", criterion);
</script>

<div class="ma-1 ml-3 mr-3 pa-1">
  <Tooltip bottom>
    <Menu>
      <div slot="activator">
        <Button icon>
          <Icon path={mdiSort} />
        </Button>
      </div>
      <List>
        <ListItem on:click={defaultSort}>Pengurutan Awal</ListItem>
        <ListItem on:click={newSortCriteria}>Urut Berdasarkan...</ListItem>
      </List>
    </Menu>
    <span slot="tip">atur urutan</span>
  </Tooltip>
</div>
