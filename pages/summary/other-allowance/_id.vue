<template>
  <div class="flex flex-col space-y-4 mt-4 mb-8 px-12">
    <SummaryOAllow />
  </div>
</template>

<script>
export default {
  layout: 'layout2',
  middleware: ['auth'],
  head() {
    return {
      title: 'Summary | Other Allowance',
    };
  },
};
</script>
