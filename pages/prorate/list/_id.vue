<template>
  <div>
    <ProrateList />
  </div>
</template>

<script>
export default {
  layout: 'layout2',
  middleware: ['auth'],
  head() {
    return {
      title: 'Prorate | List',
    };
  },
};
</script>
