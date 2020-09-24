<template>
  <div>
    <ESlipList />
  </div>
</template>

<script>
export default {
  layout: 'layout2',
  head() {
    return {
      title: 'E-Slip | List',
    };
  },
  middleware: ['auth'],
};
</script>
