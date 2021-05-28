<template>
  <div class="space-y-4">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        Home
      </el-breadcrumb-item>
      <el-breadcrumb-item class="text-xl">
        Tax
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flex space-x-4 items-center">
      <div class="flex-1">
        {{ content }}
      </div>
      <el-dropdown
        trigger="click"
        @command="c => handleExport(c, dir)"
      >
        <span class="el-dropdown-link">
          Export<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="pdf">
            PDF
          </el-dropdown-item>
          <el-dropdown-item command="xls">
            XLS
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="w-64">
        <el-input
          v-model="search"
          placeholder="Search"
          clearable
        />
      </div>
    </div>
    <ErrorHandler
      v-if="errors"
      :errors="errors"
    />
    <el-table
      v-loading="$apollo.loading || loadTax || loadXLSTax"
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
          <p :title="scope.row.y0" class="truncate">
            {{ scope.row.u0 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Department" width="200">
        <template slot-scope="scope">
          <p :title="scope.row.u0" class="truncate">
            {{ scope.row.u0 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="NPWP" width="160">
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
          <p title="Ins. Paid By Company" class="truncate">
            Ins. Paid By Company
          </p>
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
      <el-table-column prop="dr0" label="Other Income" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.dr0 | currency }}</span>
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
          <p title="Ins. Paid By Employee" class="truncate">
            Ins. Paid By Employee
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.er0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cz0" width="120" align="right">
        <template slot="header">
          <p title="Pajak Penghasilan Ber NPWP" class="truncate">
            Pajak Penghasilan Ber NPWP
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.cz0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="da0" width="120" align="right">
        <template slot="header">
          <p title="Pajak Penghasilan Non NPWP" class="truncate">
            Pajak Penghasilan Non NPWP
          </p>
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
          <p title="Pengembalian Pajak DTP" class="truncate">
            Pengembalian Pajak DTP
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.es0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ttax" label="Total All" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ttax | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120"></el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="page"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="items.length"
      :pager-count="pagerCount"
      layout="total, sizes, prev, pager, next"
      class="flex justify-end"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { TaxReport } from '../../apollo/query/tax';
import { GenPDFTax, GenXLSTax } from '../../apollo/mutation/tax';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      content: '',
      dir: '',
      loadTax: false,
      loadXLSTax: false,
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'i0', 'l0', 'q0',
          'u0', 'y0', 'ai0', 'bk0', 'bu0', 'cn0',
          'cy0', 'cz0', 'da0', 'db0', 'df0', 'en0',
          'eq0', 'er0', 'es0', 'gross', 'ttax',
        ],
      }),
    };
  },
  methods: {
    handleExport(c, dir) {
      if (c === 'pdf') this.genPDFTax(dir);
      else if (c === 'xls') this.genXLSTax(dir);
    },
    async genPDFTax(dir) {
      try {
        this.loadTax = true;
        await this.$apollo.mutate({
          mutation: GenPDFTax,
          variables: {
            id: this.$route.params.id,
          },
        });

        this.loadTax = false;
        window.open(`/report/${dir}/${dir}_tax.pdf`);
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
    async genXLSTax(dir) {
      try {
        this.loadXLSTax = true;
        const { data: { genXLSTax: { sStatus } } } = await this.$apollo.mutate({
          mutation: GenXLSTax,
          variables: {
            id: this.$route.params.id,
          },
        });

        if (sStatus) {
          this.loadXLSTax = false;
          window.open(`/report/${dir}/${dir}_tax.xlsx`);
        }
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
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
          const {
            period, year, dir, employee,
          } = data.taxReport;
          this.items = employee;
          this.miniSearch.addAll(this.items);
          this.content = `${period} ${year}`;
          this.dir = dir;
          this.pageSizes.push(this.items.length);
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
