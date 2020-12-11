<script>
  import {
    mdiAlertCircle,
    mdiAlertCircleOutline
  } from "@mdi/js";

  import { slide } from "svelte/transition";

  import {
    ProgressCircular,
    List,
    ListItem,
    TextField    
  } from "svelte-materialify/src";
  import Icon from "svelte-materialify/src/components/Icon";
  import { searchBorrowerName } from "./store";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let textInput = "";

  let selected = false;
  let searchResult = [];
  let elem;
  export let editMode = false;
  // let suggestion = searchBorrowerName(textInput);

  async function handleSuggestionSearch() {
    selected = false;
    searchResult = await searchBorrowerName(textInput);
    console.log(searchResult);
  }

  function selectPreviousData(suggested) {
    console.log("select based on", suggested);
    textInput = suggested.namaPeminjam;
    selected = true;
    dispatch("suggested", { ...suggested });
  }
  function closeSuggestionBox() {
    console.log("suggestion box closing");
    // selected = true;
  }
</script>

<style>
  .suggestionbox {
    padding: 0;
    margin: 0;
    border: 1px solid #dbdbdb;
    height: 10rem;
    overflow: auto;
    width: 90%;
    background-color: white;
    box-shadow: 2px 2px 24px rgba(0, 0, 0, 0.1);
    position: absolute;
    z-index: 100;
  }
</style>

<p class="text-caption text-black pb-2">&nbsp *Nama Peminjam Harus diisi</p>
<TextField
  disabled={editMode}
  outlined
  bind:this={elem}
  bind:value={textInput}
  on:input={handleSuggestionSearch}
  on:blur={closeSuggestionBox}>
  Nama Peminjam
</TextField>

{#if searchResult.length > 0 && !selected}
  <div class="suggestionbox">
    <span class="text-caption">
      <Icon path={mdiAlertCircleOutline} />
      pilih nama dibawah, untuk orang yang tercatat sebelumnya
      <br />
      <Icon path={mdiAlertCircle} />
      menulis nama baru tanpa memilih nama mengindikasikan orang yang berbeda</span>
    <List dense>
      {#each searchResult as suggestion (suggestion._id)}
        <ListItem>
          <p on:click={() => selectPreviousData(suggestion)}>
            {suggestion.namaPeminjam}
            <span class="text-caption">#{suggestion._id}</span>
          </p>
        </ListItem>
      {/each}
    </List>
  </div>
{/if}

<!-- {#if textInput && !selected}
  {#await suggestion}
    <ProgressCircular indeterminate color="success" />
  {:then searchResult}
    {#if searchResult.length > 0}
      <div class="suggestionbox">
        <span class="text-caption">
          <Icon path={mdiAlertCircleOutline} />
          pilih nama dibawah, untuk orang yang tercatat sebelumnya
          <br />
          <Icon path={mdiAlertCircle} />
          menulis nama baru tanpa memilih nama mengindikasikan orang yang
          berbeda</span>
        <List dense>
          {#each searchResult as suggestion (suggestion._id)}
            <ListItem>
              <p on:click={() => selectPreviousData(suggestion)}>
                {suggestion.namaPeminjam}
                <span class="text-caption">#{suggestion._id}</span>
              </p>
            </ListItem>
          {/each}
        </List>
      </div>
    {/if}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
{/if} -->

<!-- <Menu >    
  <div slot="activator">
    
  </div>
  <List>
    <ListItem>Option 1</ListItem>
    <ListItem>Option 2</ListItem>
    <ListItem>This is Cool</ListItem>
  </List>
</Menu> -->
