<template>
  <div id="root">
    <h1 :class="$style.title">Hello, fle-cli.</h1>
  </div>
</template>

<script>
export default {
  name: 'Root'
}
</script>

<style module>
.title {
  font-size: 36px;
  text-align: center;
}
</style>
