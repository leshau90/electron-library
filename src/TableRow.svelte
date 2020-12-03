<script>
  export let record;
  export let id;
  let active = false;
  import { columnDataFormater } from "./util/data-transform-map";
  import {columns} from './store'

  
</script>

<style>
  .active-row {
    background-color: #82d38e;
    color: rgb(15, 0, 0);
  }

  td {
    border: 1px black solid;
  }
</style>

<tr>
  {#each $columns as k}    
      <td
        class:active-row={active}
        on:mouseenter={() => (active = true)}
        on:mouseleave={() => (active = false)}
        on:click={() => console.log(id,record)}>
        {columnDataFormater[k](record[k])}
      </td>    
  {/each}
</tr>
