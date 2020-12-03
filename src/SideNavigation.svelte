<script>
  import {
    NavigationDrawer,
    List,
    ListItem,
    Avatar,
    Divider,
    Icon,
  } from "svelte-materialify/src";
  import { mdiAccount, mdiAccountGroup, mdiFace, mdiHome } from "@mdi/js";

  let mini = true;
  function mouseenter() {
    mini = false;
  }
  function mouseleave() {
    mini = true;
  }
</script>

<div 
  class="d-inline-block"
  on:mouseenter={mouseenter}
  on:mouseleave={mouseleave}>
  <NavigationDrawer absolute  {mini} class="elevation-4" style="position:fixed;min-height: 100%">
    <List dense nav>
      <ListItem>
        <span slot="prepend">
          <Icon path={mdiFace} />
        </span>
        Prof. Dr. Samdin SE., MSi.
      </ListItem>
    </List>
    <Divider />
    <List dense nav>
      <ListItem>
        <span slot="prepend">
          <Icon path={mdiHome} />
        </span>
        Home
      </ListItem>
      <ListItem>
        <span slot="prepend">
          <Icon path={mdiAccount} />
        </span>
        Account
      </ListItem>
      <ListItem>
        <span slot="prepend">
          <Icon path={mdiAccountGroup} />
        </span>
        Users
      </ListItem>
    </List>
    <Divider />
    <div class="left-space-vertical" />
  </NavigationDrawer>
</div>
