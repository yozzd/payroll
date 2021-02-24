<template>
  <div class="flex flex-col space-y-4 mt-4 mb-8 px-12">
    <el-page-header :content="content" @back="goBack">
    </el-page-header>
    <el-tabs v-model="activeName">
      <el-tab-pane label="Employment" name="a">
        <div v-if="activeName==='a'">
          <PayrollEmployment />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Private" name="b">
        <div v-if="activeName==='b'">
          <PayrollPrivate />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Earnings" name="c">
        <div v-if="activeName==='c'">
          <PayrollEarnings />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Deductions" name="d">
        <div v-if="activeName==='d'">
          <PayrollDeductions />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Payment" name="e">
        <div v-if="activeName==='e'">
          <PayrollPayment />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Flags" name="f">
        <div v-if="activeName==='f'">
          <PayrollFlags />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Manual" name="g">
        <div v-if="activeName==='g'">
          <PayrollManual />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { PayrollPeriod } from '../../apollo/query/payroll';

export default {
  data() {
    return {
      content: '',
      activeName: this.$route.query.t1,
    };
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/dashboard/' });
    },
  },
  apollo: {
    payrollPeriod: {
      query: PayrollPeriod,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { period, year } = data.payrollPeriod;
          this.content = `${period} ${year}`;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
