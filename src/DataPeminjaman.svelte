<script>
  import { Button, Col } from "svelte-materialify/src";
  import Subheader from "svelte-materialify/src/components/Subheader";
  import ItemPeminjaman from "./ItemPeminjaman.svelte";
  import Swal from 'sweetalert2'
  import { loadLendingData } from "./store.js";

  let dataPeminjaman = null;
  export let id;
  export let statusPinjam;

  async function displayLendingData() {
    // console.log('trying to display lending data --displayLendingData on id',id)
    dataPeminjaman = await loadLendingData(id);
    
    if(!dataPeminjaman || dataPeminjaman.length<1){
      Swal.fire('data tidak ada','buku belum pernah dipinjamkan','info')
    }
  }
</script>

<Col cols="6">
  {#if !dataPeminjaman}
    <Button dense rounded tile on:click={displayLendingData}>
      Tampilkan Data Peminjaman
    </Button>
  {/if}

  {#if dataPeminjaman}
    {#if statusPinjam}
      <Subheader>Sekarang</Subheader>
      <ItemPeminjaman
        dataPeminjam={dataPeminjaman.find((x) => x._id === statusPinjam)} />
    {/if}
    <Subheader>Riwayat Peminjaman</Subheader>
    {#each dataPeminjaman.filter((dd) => dd._id !== statusPinjam) as x}
      <ItemPeminjaman dataPeminjam={x} />
    {/each}
    <!-- <p>{JSON.stringify(dataPeminjaman)}</p> -->
  {/if}
</Col>
