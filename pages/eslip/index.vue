<template>
  <div>
    <ESlip />
  </div>
</template>

<script>
export default {
  layout: 'layout1',
  middleware: ['auth'],
  head() {
    return {
      title: 'E-Slip',
    };
  },
};
</script>
