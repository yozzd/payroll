<template>
  <el-tabs>
    <el-tab-pane label="Overtime">
      <PayrollOvertime />
    </el-tab-pane>
    <el-tab-pane label="Fixed Allowance">
      <PayrollFixedAllowance />
    </el-tab-pane>
    <el-tab-pane label="Non-Fixed Allowance">
      <PayrollNonFixedAllowance />
    </el-tab-pane>
    <el-tab-pane label="Retro Fill">
      <PayrollRetroFill />
    </el-tab-pane>
    <el-tab-pane label="Others">
      <PayrollEarningOthers />
    </el-tab-pane>
  </el-tabs>
</template>

