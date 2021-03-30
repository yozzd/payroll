<template>
  <div>
    <Prorate />
  </div>
</template>

<script>
export default {
  layout: 'layout1',
  middleware: ['auth'],
  head() {
    return {
      title: 'Prorate',
    };
  },
};
</script>
