<script>
  import { mdiFeatureSearch, mdiMagnify } from "@mdi/js";
  import Swal from "sweetalert2";
  import { query, sorter, gotoPage } from "./store";
  import { columnHeaderFormater as fields } from "./util/data-transform-map";
  import {
    Menu,
    Button,
    List,
    ListItem,
    Tooltip,
    Icon,
  } from "svelte-materialify/src";
  function explainSort() {}
  function explainSearch() {}
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
          <Icon path={mdiFeatureSearch} />
        </Button>
        <span slot="tip">Info List Data </span>
      </Tooltip>
    </div>
    <List>
      <ListItem on:click={explainSort}>Info Pengurutan</ListItem>
      <ListItem on:click={explainSearch}>Info Pencarian</ListItem>
    </List>
  </Menu>
</div>
