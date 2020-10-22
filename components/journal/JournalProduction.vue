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
      show-summary
      :summary-method="summaries"
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
      <el-table-column prop="y0" label="Position" width="200"></el-table-column>
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
      <el-table-column label="Code" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.w0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="l0" label="Basic" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.l0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cy0" label="Absen" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.cy0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="df0" label="Other Deduction" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.df0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ai0" label="OT" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ai0 | currency }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { JournalCategory } from '../../apollo/query/journal';
import mix from '../../mixins/payroll';

export default {
	mixins: [mix],
  data() {
    return {
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'l0', 'u0', 'v0', 'w0', 'y0',
          'ai0', 'cy0', 'df0',
        ],
      }),
    };
  },
  apollo: {
    journalCategory: {
      query: JournalCategory,
      variables() {
        return {
          id: this.$route.params.id,
          cat1: false,
          cat2: true,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employeeP } = data.journalCategory;
          this.items = employeeP;
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
