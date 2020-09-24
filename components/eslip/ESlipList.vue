<template>
  <div class="flex flex-col space-y-4 mt-4 mb-8 px-12">
    <BreadNav :breadcrumb="breadcrumb" />
    <ErrorHandler
      v-if="errors"
      :errors="errors"
    />
    <el-table :data="items" v-loading="$apollo.loading">
      <el-table-column prop="b0" label="No. Karyawan"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { EmployeeESlip } from '../../apollo/query/eslip';

export default {
  data() {
    return {
      breadcrumb: [],
      items: [],
      loadingSlip: false,
      loadingSend: false,
      errors: [],
    };
  },
  methods: {},
  apollo: {
    employeeESlip: {
      query: EmployeeESlip,
      prefetch: false,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      result({ data, loading }) {
        if (!loading) {
          const { employee, period, year } = data.employeeESlip;
          this.items = employee;

          this.breadcrumb = [
            { name: 'E-Slip', path: '/eslip' },
            { name: `${period} ${year}` },
          ];
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors.length ? graphQLErrors : networkError.result.errors;
      },
    },
  },
};
</script>
