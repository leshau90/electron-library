<script>
  import { Select, TextField, Row, Col } from "svelte-materialify/src";
  const moment = require("moment");
  export let numberFormData = { dbOp: {} };
  //   export let fieldName = "fieldUndefined";
  export let title;
  export let inputType = "number";
  let operation;
  let val1;
  let val2;
  let items = [
    {
      name: "sama dengan",
      value: "sama dengan",
    },
    {
      name: "lebih besar",
      value: "lebih besar",
    },
    {
      name: "lebih kecil",
      value: "lebih kecil",
    },
    {
      name: "diantara",
      value: "diantara",
    },
  ];

  function opChanged(op, v1, v2) {
    // console.log('normalizing value for tingodb/mongodb')

    if (!op || !v1 || (op==='diantara' && !v2)) return null;
    if (inputType === "number") {
      v1 = parseInt(v1);
      v2 = v2 && parseInt(v2);
    } else {
      console.log("input type is", inputType, moment(v1), moment(v2));
    }
    switch (op) {
      case "sama dengan":
        return v1;
      case "lebih besar":
        return { $gt: v1 };
      case "lebih kecil":
        return { $lt: v1 };
      case "diantara":
        if (inputType === "date") {
          console.log("converting to moment and comparing...");
          let v1IsFirst = moment(v1).isSameOrBefore(moment(v2));
          console.log(
            "is first value earlier?",
            v1IsFirst,
            moment(v1),
            moment(v2)
          );

          return {
            $gt: v1IsFirst ? v1 : v2,
            $lt: v1IsFirst ? v2 : v1,
          };
        } else return { $gt: Math.min(v1, v2), $lt: Math.max(v1, v2) };
      default:
        return null;
    }
  }

  $: numberFormData = opChanged(operation, val1, val2);
</script>

<Row>
  <Col cols="2"><span class="text-comment"> {title}: </span></Col>
  <Col cols="3">
    <Select {items} bind:value={operation} />
  </Col>
  {#if operation === 'lebih besar' || operation === 'lebih kecil'}
    <Col cols="1"><span class="text-comment"> dari </span></Col>
  {/if}
  <Col cols="2">
    <TextField type={inputType} dense bind:value={val1} />
  </Col>
  {#if operation && operation === 'diantara'}
    <Col cols="1"><span class="text-comment"> dan </span></Col>
    <Col cols="2">
      <TextField type={inputType} dense bind:value={val2} />
    </Col>
  {/if}
  <!-- <Col>{val1},{val2}</Col> -->
</Row>
