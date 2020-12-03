<script>
  import { data, gotoPage } from "./store";
  import BookItem from "./BookItem.svelte";
  import { onMount } from "svelte";
  import TopMenu from "./TopMenu.svelte";
  import BookDataDialog from "./BookDataDialog.svelte";
  import LendBookDialog from "./LendBookDialog.svelte";
  // import TopMenu2 from "./TopMenu2.svelte";

  let showTopMenu = true;

  //dialog related codes
  let formData;
  let dialogFormTitle;
  let activateDialog;
  let editMode = false;

  function newBookForm() {
    activateDialog = true;
    showTopMenu = false;
    editMode = false;
    dialogFormTitle = "Tambah Buku Baru";
  }

  function editBookForm(evt) {
    activateDialog = true;
    editMode = true;
    dialogFormTitle = "Edit Data Buku";
    showTopMenu = false;
    formData = { ...evt.detail.data };
  }

  //lending dialog related
  let lendingBookForm;
  let activateLendingDialog = false;
  let formLendingData = {}

  function newBookLending(evt) {
    activateLendingDialog = true;
    editMode = false;
    dialogFormTitle = "Pinjamkan Buku";
    showTopMenu = false;    

    console.log('calling new book lending dialog with this data',{...evt.detail.data})
    formLendingData = { ...evt.detail.data };
    // lendingBookForm.fillIn()
  }
  function editBookLending(evt) {
    formLendingData={}
    dialogFormTitle = "Pinjamkan Buku";
    showTopMenu = false;    

    formLendingData = { ...evt.detail.data };
    console.log('bookList -- ',formLendingData)
    activateLendingDialog = true;
    editMode = true;
    // lendingBookForm.fillIn()
  }

  onMount(() => gotoPage(0));
</script>

<!-- <TopMenu2/> -->
<TopMenu on:createbook={newBookForm} bind:showTopMenu />
<div class="d-flex mt-15  flex-column ">
  {#each $data as item, i (item._id)}
    <BookItem
      {item}
      on:editbook={editBookForm}
      number={i}
      on:lendbook={newBookLending}
      on:editbooklending={editBookLending} />
  {/each}
</div>

<BookDataDialog
  formTitle={dialogFormTitle}
  {formData}
  bind:activateDialog
  bind:editMode
  on:bookDataDialogClosed={() => (showTopMenu = true)} />

<LendBookDialog
  formTitle={dialogFormTitle}
  {formLendingData}
  bind:this={lendingBookForm}
  bind:activateLendingDialog
  bind:editMode
  on:lendingdialogclosed={() => (showTopMenu = true)} />
