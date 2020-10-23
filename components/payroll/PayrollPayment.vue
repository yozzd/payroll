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
      <el-table-column prop="ca0" label="Earning" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ca0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="do0" label="Deduction" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.do0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dp0" label="Revenue" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.dp0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="eb0" label="Take Home Pay" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.eb0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ec0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Total Transfer by Mandiri">
              Total Transfer by Mandiri
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ec0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ed0" label="Total By Cash" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ed0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="120"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollPayment } from '../../apollo/query/payroll';
import mix from '../../mixins/payroll';

export default {
	mixins: [mix],
  data() {
    return {
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'ca0',
          'do0', 'dp0', 'eb0', 'ec0',
          'ed0',
        ],
      }),
    };
  },
  apollo: {
    payrollPayment: {
      query: PayrollPayment,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.payrollPayment;
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
