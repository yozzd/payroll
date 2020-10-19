<template>
  <div>
    <PayrollSlip />
  </div>
</template>

<script>
export default {
  layout: 'layout2',
  head() {
    return {
      title: 'Payroll | Slip',
    };
  },
  middleware: ['auth'],
};
</script>
