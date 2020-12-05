<script>
  import { MaterialApp } from "svelte-materialify";
  import {currentView,view} from "./store"
  import BookList from "./BookList.svelte";
  import Borrowers from "./Borrowers.svelte";
  import Home from "./Home.svelte";
  import Lendings from "./Lendings.svelte";   
</script>

<MaterialApp>
  {#if $currentView == view.HOME}
    <Home />
  {:else if $currentView == view.BOOKLIST}
    <BookList />
  {:else if $currentView == view.BORROWERS}
    <Borrowers />
  {:else if $currentView == view.LENDINGS}
    <Lendings />
  {/if}
</MaterialApp>
