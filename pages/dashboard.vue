<template>
  <div>
    <Dashboard />
  </div>
</template>

<script>
export default {
  layout: 'layout1',
  head() {
    return {
      title: 'Dashboard',
    };
  },
  middleware: ['auth'],
};
</script>
