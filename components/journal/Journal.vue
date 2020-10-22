<template>
  <div class="flex flex-col space-y-4 mt-4 mb-8 px-12">
    <el-page-header :content="content" @back="goBack">
    </el-page-header>
    <el-tabs>
      <el-tab-pane label="Production">
        <JournalProduction />
      </el-tab-pane>
      <el-tab-pane label="Administration">
        <JournalAdministration/>
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