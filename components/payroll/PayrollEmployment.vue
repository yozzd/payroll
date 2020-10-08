<template>
  <div class="space-y-2">
    <ErrorHandler
      v-if="errors"
      :errors="errors"
    />
    <div class="flex space-x-4 items-center">
      <div class="flex-1">
        Total {{ items.length }} items
      </div>
      <div class="w-64">
        <el-input
          v-model="search"
          placeholder="Search"
          clearable
        />
      </div>
    </div>
    <el-table
      v-loading="$apollo.loading"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      size="small"
      height="500"
    >
      <el-table-column type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100" fixed></el-table-column>
      <el-table-column label="Nama Karyawan" width="200" fixed>
        <template slot-scope="scope">
          <client-only>
            <p v-snip="1" :title="scope.row.d0">
              {{ scope.row.d0 }}
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="h0" label="Status Karyawan" width="110"></el-table-column>
      <el-table-column prop="i0" label="Hired Date" width="100"></el-table-column>
      <el-table-column prop="k0" width="100">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Resign / Finish Contract Date">
              Resign / Finish Contract Date
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column label="Department" width="200">
        <template slot-scope="scope">
          <client-only>
            <p v-snip="1" :title="scope.row.u0">
              {{ scope.row.u0 }}
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column label="Section" width="200">
        <template slot-scope="scope">
          <client-only>
            <p v-snip="1" :title="scope.row.v0">
              {{ scope.row.v0 }}
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="w0" label="Section Code" width="100"></el-table-column>
      <el-table-column prop="x0" label="Grade" width="100"></el-table-column>
      <el-table-column prop="y0" label="Jabatan" min-width="200"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollEmployment } from '../../apollo/query/payroll';

export default {
  data() {
    return {
      items: [],
      search: '',
      errors: [],
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'h0', 'i0', 'k0',
          'u0', 'v0', 'w0', 'x0', 'y0',
        ],
      }),
    };
  },
  computed: {
    tableData() {
      if (this.search) {
        return this.miniSearch.search(this.search, { prefix: true });
      }
      return this.items;
    },
  },
  apollo: {
    payrollEmployment: {
      query: PayrollEmployment,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.payrollEmployment;
          this.items = employee;
          this.miniSearch.addAll(this.items);
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
