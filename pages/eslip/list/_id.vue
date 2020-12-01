<template>
  <div>
    <ESlipList />
  </div>
</template>

<script>
export default {
  layout: 'layout2',
  middleware: ['auth'],
  head() {
    return {
      title: 'E-Slip | List',
    };
  },
};
</script>
