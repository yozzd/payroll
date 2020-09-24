<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="n in breadcrumb"
      :key="n.name"
      :to="n.path ? { path: n.path } : {}"
    >
      {{ n.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: {
    breadcrumb: {
      type: Array,
      required: true,
    },
  },
};
</script>
