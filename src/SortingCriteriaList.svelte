<script>
  import SortingItem from "./SortingItem.svelte";
  export let sortingItems = {};
</script>

{#if Object.keys(sortingItems).length > 0}
  {#each Object.keys(sortingItems) as sort, i (i)}
    <SortingItem bind:sortObject={sortingItems} keyName={sort} />
  {/each}
{/if}
