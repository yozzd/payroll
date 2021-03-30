<template>
  <div class="space-y-4">
    <el-page-header :content="content" @back="goBack">
    </el-page-header>
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
      <el-table-column label="Hired Date" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.i0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Position" width="200">
        <template slot-scope="scope">
          <client-only>
            <p v-snip="1" :title="scope.row.y0">
              {{ scope.row.u0 }}
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column label="Department" width="200">
        <template slot-scope="scope">
          <client-only>
            <p v-snip="1" :title="scope.row.u0">
              {{ scope.row.u0 }}
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column label="NPWP" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.q0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="l0" label="Basic Salary" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.l0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ai0" label="OT Amount" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ai0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bk0" label="Allowance" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.bk0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cn0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Ins. Paid By Company">
              Ins. Paid By Company
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.cn0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bu0" label="Retro Fill" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.bu0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="en0" label="Pesangon, Serv." width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.en0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="eq0" label="THR, Leave" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.eq0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="df0" label="Deduction" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.df0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cy0" label="Absent" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.cy0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gross" label="Gross" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.gross | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="er0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Ins. Paid By Employee">
              Ins. Paid By Employee
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.er0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cz0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pajak Penghasilan Ber NPWP">
              Pajak Penghasilan Ber NPWP
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.cz0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="da0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pajak Penghasilan Non NPWP">
              Pajak Penghasilan Non NPWP
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.da0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="db0" label="Total Tax" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.db0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="es0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pengembalian Pajak DTP">
              Pengembalian Pajak DTP
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.es0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ttax" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Total Tax Diatas 200 Juta">
              Total Tax Diatas 200 Juta
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ttax | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="120"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { TaxReport } from '../../apollo/query/tax';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      content: '',
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'i0', 'l0', 'q0',
          'u0', 'y0', 'ai0', 'bk0', 'bu0', 'cn0',
          'cy0', 'cz0', 'da0', 'db0', 'df0', 'en0',
          'eq0', 'er0', 'es0', 'gross0', 'ttax',
        ],
      }),
    };
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/dashboard/' });
    },
  },
  apollo: {
    taxReport: {
      query: TaxReport,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { period, year, employee } = data.taxReport;
          this.items = employee;
          this.miniSearch.addAll(this.items);
          this.content = `${period} ${year}`;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
