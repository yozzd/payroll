<template>
  <div>
    <Dashboard />
  </div>
</template>

<script>
export default {
  layout: 'layout1',
  middleware: ['auth'],
  head() {
    return {
      title: 'Dashboard',
    };
  },
};
</script>
