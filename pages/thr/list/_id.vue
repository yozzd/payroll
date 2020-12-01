<template>
  <div>
    <ThrList />
  </div>
</template>

<script>
export default {
  layout: 'layout2',
  middleware: ['auth'],
  head() {
    return {
      title: 'THR | List',
    };
  },
};
</script>
