<template>
  <div class="flex flex-col space-y-4 mt-4 mb-8 px-12">
    <BreadNav :breadcrumb="breadcrumb" />
    <ErrorHandler
      v-if="errors"
      :errors="errors"
    />
    <el-table
      v-loading="$apollo.loading"
      :data="items"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
        :selectable="selectDisable"
      ></el-table-column>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="b0" label="No. Karyawan" width="120"></el-table-column>
      <el-table-column prop="c0" label="Nama Karyawan"></el-table-column>
      <el-table-column prop="h0" label="Email"></el-table-column>
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
      multipleSelection: [],
      errors: [],
    };
  },
  methods: {
    selectDisable(r) {
      return r.h0 !== '';
    },
    handleSelectionChange(a) {
      this.multipleSelection = a;
    },
  },
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
