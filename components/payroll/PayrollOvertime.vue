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
      <el-table-column label="Lembur Normal" align="center">
        <el-table-column prop="ab0" label="Hour" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ab0 | frac2 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ac0" label="Amount" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ac0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Lembur Dinas" align="center">
        <el-table-column prop="ad0" label="Hour" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ad0 | frac2 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ae0" label="Amount" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ae0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Insentif" align="center">
        <el-table-column prop="af0" label="Hour" width="100" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.af0 | frac2 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ag0" label="Rate" width="100" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ag0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ah0" label="Amount" width="100" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ah0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="ai0" label="Total" min-width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ai0 | currency }}</span>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollOvertime } from '../../apollo/query/payroll';

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
          '_id', 'd0', 'e0', 'ab0', 'ac0', 'ad0',
          'ae0', 'af0', 'ag0', 'ah0', 'ai0',
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
  methods: {
    summaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = this.$options.filters.currency(values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0));
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
    finalRow({ row }) {
      if (row.ex0 === 1) {
        return 'final-row';
      }
      return '';
    }
  },
  apollo: {
    payrollOvertime: {
      query: PayrollOvertime,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.payrollOvertime;
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
