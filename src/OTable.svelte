<script>
  import {
    columnDataFormater,
    columnHeaderFormater,
    defaultWidthColumn,
  } from "./util/data-transform-map";
  import { columns,data } from "./store";
  
  import TableRow from "./TableRow.svelte";
</script>
<style>
  .containerx {
    display: flex;
    flex-direction: column;
    margin-bottom: 3px;
  }

  table,
  td,
  th {
    border: 1px black solid;
  }

  .data-table {
    font-size: small;
    width: 100%;
  }

  .pager-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    box-sizing: border-box;
  }
  .pager-number {
    margin: 2px;
    /* display: inline-block; */
    /* border: solid 1px black; */
    /* height: 20px; */
  }
</style>


<div class="containerx">
  <div class="center">
    {#if Array.isArray(data)}
      <table class="data-table">
        {#each $columns as header}
          {#if defaultWidthColumn[header]}
            <col style="width: {defaultWidthColumn[header]}" />
          {:else}
            <col style="width: 4%" />
          {/if}
        {/each}
        <thead>
          <tr on>
            {#each $columns as header}
              <th>{columnHeaderFormater[header]}</th>
            {/each}
          </tr>
        </thead>

        <tbody>
          {#each data as row (row._id)}
            <TableRow record={row} id={row._id} />
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
  <div class="pager-container">
    <!-- <p>{pageMap}</p> -->
    <!-- <p>{JSON.stringify(cursorTest)}</p>   -->
    {#each pageMap as pageNumber}
      <div class="pager-number">
        <a
          href="/"
          on:click|preventDefault={() => gotoPage(pageNumber)}>{pageNumber + 1}</a>
      </div>
    {/each}
  </div>
</div>
