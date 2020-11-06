<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="Absent" name="da">
      <div v-if="activeName==='da'">
        <PayrollAbsent />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Fee" name="db">
      <div v-if="activeName==='db'">
        <PayrollFee />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Tax" name="dc">
      <div v-if="activeName==='dc'">
        <PayrollTax />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Reduction" name="dd">
      <div v-if="activeName==='dd'">
        <PayrollReduction />
      </div>
    </el-tab-pane>
    <el-tab-pane label="Others" name="de">
      <div v-if="activeName==='de'">
        <PayrollDeductionOthers />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'da',
    };
  },
};
</script>
