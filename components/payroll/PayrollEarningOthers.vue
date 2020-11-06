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
      <el-table-column prop="bv0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tambahan Lain Tidak Kena Pajak">
              Tambahan Lain Tidak Kena Pajak
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bv0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="THR Prorate" align="center">
        <el-table-column prop="bw0" label="Months" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.bw0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bx0" label="Amount" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.bx0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="dr0" label="Bonus" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.dr0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Uang Pisah" align="center">
        <el-table-column prop="ds0" label="Lama Kerja" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ds0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dt0" label="Amount" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.dt0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Uang Pesangon" align="center">
        <el-table-column prop="du0" label="Lama Kerja" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.du0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dv0" label="Amount" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.dv0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Uang Penghargaan Masa Kerja" align="center">
        <el-table-column prop="dw0" label="Lama Kerja" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.dw0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dx0" label="Amount" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.dx0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="dy0" min-width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Uang Penggantian Hak">
              Uang Penggantian Hak
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.dy0 | currency }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollEarningOthers } from '../../apollo/query/payroll';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'bv0', 'bw0', 'bx0',
          'dr0', 'ds0', 'dt0', 'du0',
          'dv0', 'dw0', 'dx0', 'dy0',
        ],
      }),
    };
  },
  apollo: {
    payrollEarningOthers: {
      query: PayrollEarningOthers,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.payrollEarningOthers;
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
