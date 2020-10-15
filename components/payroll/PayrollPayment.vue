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
      <el-table-column label="Nama Karyawan" width="200" fixed>
        <template slot-scope="scope">
          <client-only>
            <p v-snip="1" :title="scope.row.d0">
              {{ scope.row.d0 }}
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="ca0" label="Earning" width="120" align="right"></el-table-column>
      <el-table-column prop="do0" label="Deduction" width="120" align="right"></el-table-column>
      <el-table-column prop="dp0" label="Revenue" width="120" align="right"></el-table-column>
      <el-table-column prop="eb0" label="Take Home Pay" width="120" align="right"></el-table-column>
      <el-table-column prop="ec0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Total Transfer by Mandiri">
              Total Transfer by Mandiri
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="ed0" label="Total By Cash" min-width="120" align="right"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollPayment } from '../../apollo/query/payroll';

export default {
  data() {
    return {
      items: [],
      search: '',
      errors: [],
      arrSum: [],
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
  computed: {
    tableData() {
      if (this.search) {
        return this.miniSearch.search(this.search, { prefix: true });
      }
      return this.items;
    },
  },
  methods: {
    summaries() {
      return this.arrSum;
    },
    finalRow({ row }) {
      if (row.ex0 === 1) {
        return 'final-row';
      }
      return '';
    }
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
          const {
            employee,
            total: {
              sca0, sdo0, sdp0,
              seb0, sec0, sed0,
            },
          } = data.payrollPayment;

          this.items = employee;
          this.miniSearch.addAll(this.items);
          this.arrSum = [
            'Total', '', '',
            sca0, sdo0, sdp0,
            seb0, sec0, sed0,
          ];
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
