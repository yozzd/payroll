<template>
  <div class="flex flex-col space-y-4 mt-4 mb-8 px-12">
    <el-page-header :content="content" @back="goBack">
    </el-page-header>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: '',
    };
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/dashboard/' });
    },
  },
};
</script>
