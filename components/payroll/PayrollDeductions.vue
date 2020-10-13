<template>
  <el-tabs>
    <el-tab-pane label="Absent">
      <PayrollAbsent />
    </el-tab-pane>
    <el-tab-pane label="Fee">
      <PayrollFee />
    </el-tab-pane>
    <el-tab-pane label="Tax">
      <PayrollTax />
    </el-tab-pane>
    <el-tab-pane label="Reduction">
      <PayrollReduction />
    </el-tab-pane>
    <el-tab-pane label="Others">
      <PayrollDeductionOthers />
    </el-tab-pane>
  </el-tabs>
</template>
