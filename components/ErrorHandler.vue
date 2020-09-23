<template>
  <div>
    <el-alert
      v-for="(error, errorIndex) in errors"
      :key="errorIndex"
      title="Error"
      type="error"
    >
      <span>
        {{ error.message }}
      </span>
    </el-alert>
  </div>
</template>

<script>
export default {
  props: {
    errors: {
      type: Array,
      required: true,
    },
  },
};
</script>
