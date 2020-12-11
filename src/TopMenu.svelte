<script>
  import {
    mdiArrowCollapseLeft,
    mdiArrowCollapseRight,
    mdiArrowLeft,
    mdiArrowRight,
    mdiPlus,
  } from "@mdi/js";
  import { Button, Icon } from "svelte-materialify/src";
  import SorterMenu from "./SorterMenu.svelte";
  import {
    gotoPage,
    pageNumbers,
    total,
    data,
    recordPerPage,
    lastPage,
  } from "./store";

  import { createEventDispatcher } from "svelte";
  import Tooltip from "svelte-materialify/src/components/Tooltip";
  import Swal from "sweetalert2";
  import SearchButton from "./SearchButton.svelte";
  import ViewMenu from "./ViewMenu.svelte";

  const dispatch = createEventDispatcher();
  $lastPage = 1;

  function callNewBookDialog() {
    dispatch("createbook");
  }

  export let showTopMenu = true;
  // export const hideTopNav = ()=>{active=false}
  // export const showTopNav = ()=>{active=true}

  function gotoNextPage() {
    if ($lastPage < Math.ceil($total / $recordPerPage)) $lastPage++;
    gotoPage($lastPage);
  }
  function gotoPreviousPage() {
    if ($lastPage >= 2) $lastPage--;
    gotoPage($lastPage);
  }
  function gotoFirstPage() {
    $lastPage = 1;
    gotoPage($lastPage);
  }
  function gotoLastPage() {
    $lastPage = Math.ceil($total / $recordPerPage);
    gotoPage($lastPage);
  }

  function selectPage() {
    let max = Math.ceil($total / $recordPerPage);
    if (max == 1) return;
    else {
      Swal.fire({
        title: "Lompat Halaman",
        text: `Masukan Nomor Halaman 1 s/d ${max} `,
        input: "text",
        showCancelButton: true,
        inputValidator: (hal) => {
          let i = parseInt(hal);
          if (!i || i < 1 || i > max) return "halaman salah";
        },
      }).then((halaman) => {
        // console.log('jump to page',halaman.value)
        if (!halaman.value) return;
        $lastPage = parseInt(halaman.value);
        gotoPage($lastPage);
      });
    }
  }

  function setPerPageAndJump() {
    let max = Math.ceil($total / $recordPerPage);
    if (max == 1) return;
    else {
      Swal.fire({
        title: "Buku per-halaman",
        text: `Masukan Nomor Halaman 1 s/d ${$total}, menampilkan data terlalu banyak sekaligus bisa mengurangi performa`,
        input: "text",
        showCancelButton: true,
        inputValidator: (perHalaman) => {
          let i = parseInt(perHalaman);
          if (!i || i < 1 || i > $total) return "jumlah salah";
        },
      }).then((perHalaman) => {
        // console.log('jump to page',halaman.value)
        if (!perHalaman.value) return;

        let topIndexAtCurrentPage = ($lastPage - 1) * $recordPerPage;
        $recordPerPage = parseInt(perHalaman.value);
        $lastPage = Math.floor(topIndexAtCurrentPage / $recordPerPage) + 1;
        gotoPage($lastPage);
      });
    }
  }
</script>

<style>
  .topcontainer {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
  }
</style>

{#if showTopMenu}
  <div
    class="topcontainer d-flex flex-row-reverse justify-right white-text grey darken-2">
    <div class="ma-1 ml-3 mr-3 pa-1">
      <Button size="small" class="green lighten-2" on:click={callNewBookDialog}>
        <Icon path={mdiPlus} />
        Tambah
      </Button>
    </div>
    <SorterMenu />
    <div class="ma-1 ml-3 mr-3 pa-1 ">
      <Tooltip bottom>
        <span class="text-h6" on:click={setPerPageAndJump}>
          {$data.length}
          dari
          {$total}
        </span>
        <span slot="tip">Jumlah Data
          <br />
          klik untuk mengatur berapa data yang ditampilkan per-halaman
        </span>
      </Tooltip>
    </div>
    <div class="mt-1 mb-1 mr-3  pa-1">
      <Tooltip bottom>
        <Button icon on:click={gotoLastPage}>
          <Icon path={mdiArrowCollapseRight} />
        </Button>
        <span slot="tip">Halaman Terakhir</span>
      </Tooltip>
    </div>

    <div class="mt-1 mb-1 pa-1">
      <Tooltip bottom>
        <Button icon on:click={gotoNextPage}>
          <Icon path={mdiArrowRight} />
        </Button>
        <span slot="tip">Halaman Berikutnya</span>
      </Tooltip>
    </div>
    <div class="mt-1 mb-1 pa-1">
      <Tooltip bottom>
        <Button icon on:click={selectPage}>
          <span clas="text-comment">{$lastPage}</span>
        </Button>
        <span slot="tip">Halaman <br /> klik untuk lompat halaman </span>
      </Tooltip>
    </div>
    <div class="mt-1 mb-1 pa-1">
      <Tooltip bottom>
        <Button icon on:click={gotoPreviousPage}>
          <Icon path={mdiArrowLeft} />
        </Button>
        <span slot="tip">Halaman Sebelumnya</span>
      </Tooltip>
    </div>
    <div class="mt-1 mb-1 pa-1">
      <Tooltip bottom>
        <Button icon on:click={gotoFirstPage}>
          <Icon path={mdiArrowCollapseLeft} />
        </Button>
        <span slot="tip">Halaman Awal</span>
      </Tooltip>
    </div>
    <SearchButton on:showAdvSearchDialog />
    <ViewMenu />
  </div>
{/if}
