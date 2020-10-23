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
      <el-table-column prop="d0" label="Nama Karyawan" width="200" fixed>
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
        <template slot-scope="scope">
          <span>{{ scope.row.bl0 | currency }}</span>
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
        <template slot-scope="scope">
          <span>{{ scope.row.bm0 | currency }}</span>
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
        <template slot-scope="scope">
          <span>{{ scope.row.bn0 | currency }}</span>
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
        <template slot-scope="scope">
          <span>{{ scope.row.bo0 | currency }}</span>
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
        <template slot-scope="scope">
          <span>{{ scope.row.bp0 | currency }}</span>
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
        <template slot-scope="scope">
          <span>{{ scope.row.bq0 | currency }}</span>
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
        <template slot-scope="scope">
          <span>{{ scope.row.br0 | currency }}</span>
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
        <template slot-scope="scope">
          <span>{{ scope.row.bs0 | currency }}</span>
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
        <template slot-scope="scope">
          <span>{{ scope.row.bt0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bu0" label="Total" min-width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.bu0 | currency }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollRetroFill } from '../../apollo/query/payroll';
import mix from '../../mixins/payroll';

export default {
	mixins: [mix],
  data() {
    return {
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
          const { employee } = data.payrollRetroFill;
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
