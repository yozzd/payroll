<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="n in breadcrumb"
      :key="n.name"
    >
      <nuxt-link v-if="n.path" :to="n.path">
        {{ n.name }}
      </nuxt-link>
      <span v-else>
        {{ n.name }}
      </span>
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
