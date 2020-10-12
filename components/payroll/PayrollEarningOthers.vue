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
      <el-table-column label="Nama Karyawan" width="200" fixed>
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
      </el-table-column>
      <el-table-column label="THR Prorate" align="center">
        <el-table-column prop="bw0" label="Days" width="120" align="right"></el-table-column>
        <el-table-column prop="bx0" label="Amount" width="120" align="right"></el-table-column>
      </el-table-column>
      <el-table-column label="Cuti" align="center">
        <el-table-column prop="by0" label="Days" width="120" align="right"></el-table-column>
        <el-table-column prop="bz0" label="Amount" width="120" align="right"></el-table-column>
      </el-table-column>
      <el-table-column prop="dr0" label="Bonus" width="120" align="right"></el-table-column>
      <el-table-column label="Uang Pisah" align="center">
        <el-table-column prop="ds0" label="Lama Kerja" width="120" align="right"></el-table-column>
        <el-table-column prop="dt0" label="Amount" width="120" align="right"></el-table-column>
      </el-table-column>
      <el-table-column label="Uang Pesangon" align="center">
        <el-table-column prop="du0" label="Lama Kerja" width="120" align="right"></el-table-column>
        <el-table-column prop="dv0" label="Amount" width="120" align="right"></el-table-column>
      </el-table-column>
      <el-table-column label="Uang Penghargaan Masa Kerja" align="center">
        <el-table-column prop="dw0" label="Lama Kerja" width="120" align="right"></el-table-column>
        <el-table-column prop="dx0" label="Amount" width="120" align="right"></el-table-column>
      </el-table-column>
      <el-table-column prop="dy0" min-width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Uang Penggantian Hak">
              Uang Penggantian Hak
            </p>
          </client-only>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollEarningOthers } from '../../apollo/query/payroll';

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
          '_id', 'd0', 'e0', 'bv0', 'bw0', 'bx0',
          'by0', 'bz0', 'dr0', 'ds0', 'dt0', 'du0',
          'dv0', 'dw0', 'dx0', 'dy0',
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
          const {
            employee,
            total: {
              sbv0, sbw0, sbx0,
              sby0, sbz0, sdr0,
              sds0, sdt0, sdu0,
              sdv0, sdw0, sdx0,
              sdy0,
            },
          } = data.payrollEarningOthers;

          this.items = employee;
          this.miniSearch.addAll(this.items);
          this.arrSum = [
            'Total', '', '',
            sbv0, sbw0, sbx0,
            sby0, sbz0, sdr0,
            sds0, sdt0, sdu0,
            sdv0, sdw0, sdx0,
            sdy0,
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
