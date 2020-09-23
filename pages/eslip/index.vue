<template>
  <div>
    <ESlip />
  </div>
</template>

<script>
export default {
  layout: 'layout1',
  head() {
    return {
      title: 'E-Slip',
    };
  },
  middleware: ['auth'],
};
</script>
