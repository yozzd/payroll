<template>
  <div>
    <Journal />
  </div>
</template>

<script>
export default {
  layout: 'layout2',
  middleware: ['auth'],
  head() {
    return {
      title: 'Payroll | Journal',
    };
  },
};
</script>
