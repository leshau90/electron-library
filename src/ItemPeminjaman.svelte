<script>
  import Card from "svelte-materialify/src/components/Card";
  import Col from "svelte-materialify/src/components/Grid/Col.svelte";
  import Row from "svelte-materialify/src/components/Grid/Row.svelte";
  import Moment from "moment";
  import Tooltip from "svelte-materialify/src/components/Tooltip";
  export let dataPeminjam = {};

  function isInvalidDate(d){
      return isNaN(new Date(d).getTime())
  }
</script>

<Row>
  <Col cols="4">
  <Tooltip bottom>
    <span class="text-comment">{dataPeminjam.namaPeminjam}</span>
    <span slot='tip'>alamat: {dataPeminjam.alamatPeminjam   } </span>
  </Tooltip>
  </Col>
  <Col cols="4">
    <p class="text-comment">
      {!isInvalidDate(dataPeminjam.tanggalPinjam)?Moment(dataPeminjam.tanggalPinjam).format('DD/MM/YYYY') : '-'}
    </p>
  </Col>
  <Col cols="4">
    <p class="text-comment">
      {!isInvalidDate(dataPeminjam.tanggalKembali)?Moment(dataPeminjam.tanggalKembali).format('DD/MM/YYYY') : '-'}
    </p>
  </Col>
</Row>
