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
      <el-table-column prop="bl0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pembetulan Pembayaran Koreksi Absen">
              Pembetulan Pembayaran Koreksi Absen
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="bm0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pembetulan Pembayaran Koreksi Gaji & Hari Kerja">
              Pembetulan Pembayaran Koreksi Gaji & Hari Kerja
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="bn0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pembetulan Pembayaran OT">
              Pembetulan Pembayaran OT
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="bo0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pembetulan Pembayaran Tunjangan">
              Pembetulan Pembayaran Tunjangan
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="bp0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pembetulan Pembayaran Insentif">
              Pembetulan Pembayaran Insentif
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="bq0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pembetulan Pembayaran THR">
              Pembetulan Pembayaran THR
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="br0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pembetulan Pembayaran Allowance">
              Pembetulan Pembayaran Allowance
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="bs0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pembetulan Pembayaran Uang Makan Security">
              Pembetulan Pembayaran Uang Makan Security
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="bt0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pembetulan Pembayaran Others">
              Pembetulan Pembayaran Others
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="bu0" min-width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Total Pembetulan Pembayaran">
              Total Pembetulan Pembayaran
            </p>
          </client-only>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollRetroFill } from '../../apollo/query/payroll';

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
          '_id', 'd0', 'e0', 'bl0', 'bm0', 'bn0',
          'bo0', 'bp0', 'bq0', 'br0', 'bs0', 'bt0',
          'bu0',
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
    payrollRetroFill: {
      query: PayrollRetroFill,
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
              sbl0, sbm0, sbn0,
              sbo0, sbp0, sbq0,
              sbr0, sbs0, sbt0,
              sbu0,
            },
          } = data.payrollRetroFill;

          this.items = employee;
          this.miniSearch.addAll(this.items);
          this.arrSum = [
            'Total', '', '',
            sbl0, sbm0, sbn0,
            sbo0, sbp0, sbq0,
            sbr0, sbs0, sbt0,
            sbu0,
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
