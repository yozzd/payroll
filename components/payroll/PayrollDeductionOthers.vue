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
      <el-table-column prop="dk0" label="Dana Pinjaman" width="120" align="right"></el-table-column>
      <el-table-column prop="dl0" label="Canteen" width="120" align="right"></el-table-column>
      <el-table-column prop="dm0" label="Kopkar dan BMI" width="120" align="right"></el-table-column>
      <el-table-column prop="dn0" min-width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pph21 Kurang Bayar">
              Pph21 Kurang Bayar
            </p>
          </client-only>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollDeductionOthers } from '../../apollo/query/payroll';

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
          '_id', 'd0', 'e0', 'dk0',
          'dl0', 'dm0', 'dn0',
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
    payrollDeductionOthers: {
      query: PayrollDeductionOthers,
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
              sdk0, sdl0, sdm0, sdn0,
            },
          } = data.payrollDeductionOthers;

          this.items = employee;
          this.miniSearch.addAll(this.items);
          this.arrSum = [
            'Total', '', '',
            sdk0, sdl0, sdm0, sdn0,
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