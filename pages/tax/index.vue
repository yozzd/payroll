<template>
  <div>
    <Tax />
  </div>
</template>

<script>
export default {
  layout: 'layout1',
  middleware: ['auth'],
  head() {
    return {
      title: 'Tax',
    };
  },
};
</script>
