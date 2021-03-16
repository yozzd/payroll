<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="Basic" name="ca">
      <div v-if="activeName==='ca'">
        <PayrollBasic />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Overtime" name="cb">
      <div v-if="activeName==='cb'">
        <PayrollOvertime />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Fixed Allowance" name="cc">
      <div v-if="activeName==='cc'">
        <PayrollFixedAllowance />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Non-Fixed Allowance" name="cd">
      <div v-if="activeName==='cd'">
        <PayrollNonFixedAllowance />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Retro Fill" name="ce">
      <div v-if="activeName==='ce'">
        <PayrollRetroFill />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Leave" name="cf">
      <div v-if="activeName==='cf'">
        <PayrollLeave />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Others" name="cg">
      <div v-if="activeName==='cg'">
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
