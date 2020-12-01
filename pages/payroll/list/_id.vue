<template>
  <div>
    <PayrollList />
  </div>
</template>

<script>
export default {
  layout: 'layout2',
  middleware: ['auth'],
  head() {
    return {
      title: 'Payroll | List',
    };
  },
};
</script>
