<template>
  <div>
    <Dashboard />
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'Dashboard',
    };
  },
  middleware: ['auth'],
};
</script>
