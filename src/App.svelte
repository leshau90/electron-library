<script>
  import { MaterialApp } from "svelte-materialify";
  import {currentView,VIEW} from "./store"
  import BookList from "./BookList.svelte";
  import Borrowers from "./Borrowers.svelte";
  import Home from "./Home.svelte";
  import {onMount} from 'svelte'
  import Lendings from "./Lendings.svelte";   


  onMount(()=>{
    console.log('Application mounted and the view is', $currentView)
  })
</script>

<MaterialApp>
  {#if $currentView == VIEW.HOME}
    <Home />
  {:else if $currentView == VIEW.BOOKLIST}
    <BookList />
  {:else if $currentView == VIEW.BORROWERS}
    <Borrowers />
  {:else if $currentView == VIEW.LENDINGS}
    <Lendings />
  {/if}
</MaterialApp>
