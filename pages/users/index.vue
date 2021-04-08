<template>
  <div>
    <Users />
  </div>
</template>

<script>
export default {
  layout: 'layout1',
  middleware: ['auth'],
  head() {
    return {
      title: 'User Management',
    };
  },
};
</script>
