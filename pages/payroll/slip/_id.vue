<template>
  <div class="flex flex-col space-y-4 mt-4 mb-8 px-12">
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
