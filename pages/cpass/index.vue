<template>
  <div>
    <CPass />
  </div>
</template>

<script>
export default {
  layout: 'layout1',
  middleware: ['auth'],
  head() {
    return {
      title: 'Change Password',
    };
  },
};
</script>
