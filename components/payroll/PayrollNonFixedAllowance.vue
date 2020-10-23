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
      border
      :summary-method="summaries"
      :row-class-name="finalRow"
    >
      <el-table-column type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100" fixed></el-table-column>
      <el-table-column prop="e0" label="Nama Karyawan" width="200" fixed>
        <template slot-scope="scope">
          <client-only>
            <p v-snip="1" :title="scope.row.d0">
              {{ scope.row.d0 }}
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="ba0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Fungsional">
              Tj. Tidak Tetap Fungsional
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ba0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bb0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Shift">
              Tj. Tidak Tetap Shift
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bb0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bc0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Tig Welding">
              Tj. Tidak Tetap Tig Welding
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bc0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bd0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Operator Plasma">
              Tj. Tidak Tetap Operator Plasma
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bd0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="be0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap LKS">
              Tj. Tidak Tetap LKS
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.be0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bf0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Koperasi">
              Tj. Tidak Tetap Koperasi
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bf0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bg0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Quality System">
              Tj. Tidak Tetap Quality System
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bg0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bh0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Pengharagaan Masa Kerja">
              Tj. Tidak Tetap Penghargaan Masa Kerja
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bh0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bi0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Others">
              Tj. Tidak Tetap Others
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bi0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bj0" label="Total" min-width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.bj0 | currency }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollNonFixedAllowance } from '../../apollo/query/payroll';
import mix from '../../mixins/payroll';

export default {
	mixins: [mix],
  data() {
    return {
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'ba0', 'bb0', 'bc0',
          'bd0', 'be0', 'bf0', 'bg0', 'bh0', 'bi0',
          'bj0',
        ],
      }),
    };
  },
  apollo: {
    payrollNonFixedAllowance: {
      query: PayrollNonFixedAllowance,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.payrollNonFixedAllowance;
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
