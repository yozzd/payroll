<template>
  <div>
    <Thr />
  </div>
</template>

<script>
export default {
  layout: 'layout1',
  middleware: ['auth'],
  head() {
    return {
      title: 'THR',
    };
  },
};
</script>
