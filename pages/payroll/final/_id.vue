<template>
  <div>
    <PayrollFinal />
  </div>
</template>

<script>
export default {
  layout: 'layout2',
  middleware: ['auth'],
  head() {
    return {
      title: 'Payroll | Final Payment',
    };
  },
};
</script>
