<script>
  import { Col, Select } from "svelte-materialify/src";
  import {
    columnHeaderFormater as keyToNameMap,
    sorterNameToValues,
  } from "./util/data-transform-map";
  //   import {$} from './store'

  export let sortObject;
  export let keyName;

  let items = Object.keys(keyToNameMap)
    .filter(
      (x) =>
        !Object.keys(sortObject).includes(x) ||
        x === keyName ||
        x !== "kategori"
    )
    .map((x) => ({
      name: keyToNameMap[x],
      value: keyToNameMap[x],
    }));
  //   console.log(items);
  //   console.log(items.find((x) => x.value === keyName));
  let selectedKey = keyToNameMap[keyName];
  let directions = sorterNameToValues[selectedKey].options;
  let direction = directions.find((x) => x.queryVal == sortObject[keyName]).value;

  let lastKey = selectedKey;

  function getDirectionVal() {
    if (!direction) return -1;
    let res = sorterNameToValues[selectedKey].options.find(
      (x) => x === direction
    );
    if (!res) return -1;
    if (res.queryVal) return res.queryVal;
    else return -1;
  }

  function getKeyVal(key) {
    if (key) return sorterNameToValues[key].key;
    else return sorterNameToValues[selectedKey].key;
  }
//   $: console.log("$sorter object should change to", sortObject);
  // $: console.log("current dialog state", selectedKey,direction,directions,'last key', lastKey);
  $: if (selectedKey && direction) {
    if (selectedKey === lastKey) {
      sortObject[getKeyVal()] = getDirectionVal();
    } else {
      console.log(
        "should be deleting this key before adding",
        getKeyVal(lastKey)
      );
      delete sortObject[getKeyVal(lastKey)];
      sortObject[getKeyVal()] = getDirectionVal();
      directions = sorterNameToValues[selectedKey].options;
      //default direction to -1 or descending
      direction = directions.find((x) => x.queryVal == -1).value;
      lastKey = selectedKey;
    }
  }
</script>

<Col cols="2"><span class="text-comment">berdasarkan</span></Col>
<Col cols="5">
  <Select {items} bind:value={selectedKey}>field</Select>
</Col>
<Col cols="5">
  <Select bind:items={directions} bind:value={direction}>arah</Select>
</Col>
