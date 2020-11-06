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
      max-height="500"
      show-summary
      :summary-method="summaries"
      :row-class-name="finalRow"
    >
      <el-table-column type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100" fixed></el-table-column>
      <el-table-column prop="d0" label="Nama Karyawan" width="200" fixed>
        <template slot-scope="scope">
          <client-only>
            <p v-snip="1" :title="scope.row.d0">
              {{ scope.row.d0 }}
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column label="Iuran JKK / JK" align="center">
        <el-table-column prop="cb0" label="JKK" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cb0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cc0" label="JK" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cc0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Iuran JHT" align="center">
        <el-table-column prop="cd0" label="Perusahaan" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cd0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ce0" label="Karyawan" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ce0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Iuran Pensiun" align="center">
        <el-table-column prop="ci0" label="Perusahaan" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ci0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cj0" label="Karyawan" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cj0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Iuran BPJS Kesehatan" align="center">
        <el-table-column prop="cq0" label="Perusahaan" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cq0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cr0" label="Karyawan" min-width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cr0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollFee } from '../../apollo/query/payroll';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'cb0', 'cc0', 'cd0', 'ce0',
          'ci0', 'cj0', 'cq0', 'cr0',
        ],
      }),
    };
  },
  apollo: {
    payrollFee: {
      query: PayrollFee,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.payrollFee;
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
