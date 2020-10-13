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
      border
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
      <el-table-column prop="ba0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Fungsional">
              Tj. Tidak Tetap Fungsional
            </p>
          </client-only>
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
      </el-table-column>
      <el-table-column prop="bc0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Tig Welding">
              Tj. Tidak Tetap Tig Welding
            </p>
          </client-only>
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
      </el-table-column>
      <el-table-column prop="be0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap LKS">
              Tj. Tidak Tetap LKS
            </p>
          </client-only>
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
      </el-table-column>
      <el-table-column prop="bg0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Quality System">
              Tj. Tidak Tetap Quality System
            </p>
          </client-only>
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
      </el-table-column>
      <el-table-column prop="bi0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Others">
              Tj. Tidak Tetap Others
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="bj0" label="Total" min-width="120" align="right"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollNonFixedAllowance } from '../../apollo/query/payroll';

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
          '_id', 'd0', 'e0', 'ba0', 'bb0', 'bc0',
          'bd0', 'be0', 'bf0', 'bg0', 'bh0', 'bi0',
          'bj0',
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
          const {
            employee,
            total: {
              sba0, sbb0, sbc0,
              sbd0, sbe0, sbf0,
              sbg0, sbh0, sbi0,
              sbj0,
            },
          } = data.payrollNonFixedAllowance;

          this.items = employee;
          this.miniSearch.addAll(this.items);
          this.arrSum = [
            'Total', '', '',
            sba0, sbb0, sbc0,
            sbd0, sbe0, sbf0,
            sbg0, sbh0, sbi0,
            sbj0,
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
