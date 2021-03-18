<template>
  <div>
    <TaxList />
  </div>
</template>

<script>
export default {
  layout: 'layout2',
  middleware: ['auth'],
  head() {
    return {
      title: 'Tax | List',
    };
  },
};
</script>
