<script>
  import { MaterialApp } from "svelte-materialify";
  import BookList from "./BookList.svelte";
  // import SideNavigation from "./SideNavigation.svelte";

  
  
  let active = false;
  function toggleNavigation() {
    active = !active;
  }

  
</script>

<MaterialApp>
  <!-- <TopMenu/>   -->
  <!-- <SideNavigation /> -->
  <BookList />
  
</MaterialApp>
<!-- <DatabaseController /> -->
