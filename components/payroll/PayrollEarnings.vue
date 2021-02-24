<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="Overtime" name="ca">
      <div v-if="activeName==='ca'">
        <PayrollOvertime />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Fixed Allowance" name="cb">
      <div v-if="activeName==='cb'">
        <PayrollFixedAllowance />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Non-Fixed Allowance" name="cc">
      <div v-if="activeName==='cc'">
        <PayrollNonFixedAllowance />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Retro Fill" name="cd">
      <div v-if="activeName==='cd'">
        <PayrollRetroFill />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Leave" name="ce">
      <div v-if="activeName==='ce'">
        <PayrollLeave />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Others" name="cf">
      <div v-if="activeName==='cf'">
        <PayrollEarningOthers />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      activeName: this.$route.query.t2,
    };
  },
};
</script>
