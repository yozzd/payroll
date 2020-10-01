<template>
  <div>
    <PayrollList />
  </div>
</template>

<script>
export default {
  layout: 'layout2',
  head() {
    return {
      title: 'Payroll | List',
    };
  },
  middleware: ['auth'],
};
</script>
