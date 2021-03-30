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
      max-height="600"
      show-summary
      border
      :summary-method="summaries"
      :row-class-name="finalRow"
    >
      <el-table-column type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100" fixed></el-table-column>
      <el-table-column prop="d0" label="Nama Karyawan" width="300" fixed>
        <template slot-scope="scope">
          <p>
            {{ scope.row.d0 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Bank No." width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.t0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Bank Name" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.s0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ec0" label="Take Home Pay" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ec0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ec0F" label="THP for Bank" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ec0F | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="120"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { TrfReport } from '../../apollo/query/trf';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 's0', 't0', 'ec0',
        ],
      }),
    };
  },
  apollo: {
    trfReport: {
      query: TrfReport,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.trfReport;
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
