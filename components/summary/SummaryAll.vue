<template>
  <div class="space-y-4">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        Home
      </el-breadcrumb-item>
      <el-breadcrumb-item class="text-xl">
        Summary All
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flex space-x-4 items-center">
      <div class="flex-1">
        January - December {{ $route.params.id }}
      </div>
      <el-dropdown
        trigger="click"
        @command="c => handleExport(c)"
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
      v-loading="$apollo.loading || loadPDFSummary || loadXLSSummary"
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
      <el-table-column label="Hire Date" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.i0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Position" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.y0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Department" width="280">
        <template slot-scope="scope">
          <span>{{ scope.row.u0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Basic" prop="tBasic" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.tBasic | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OT" prop="tOT" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.tOT | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Allowance" prop="tAllow" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.tAllow | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Other Allowance" prop="tOAllow" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.tOAllow | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pesangon, Serv" prop="tPesangon" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.tPesangon | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thr, Leave" prop="tThr" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.tThr | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Other Income" prop="tOIncome" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.tOIncome | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Absent" prop="tAbsent" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.tAbsent | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Other Deduction" prop="tODeduction" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.tODeduction | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Ins Paid By Co" prop="tICo" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.tICo | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Ins Paid By Emp" prop="tIEmp" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.tIEmp | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Tax Ready Paid" prop="tTax" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.tTax | currency }}</span>
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
import { SummaryAll } from '../../apollo/query/summary';
import { GenPDFSummaryAll, GenXLSSummaryAll } from '../../apollo/mutation/summary';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      loadPDFSummary: false,
      loadXLSSummary: false,
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'i0', 'y0', 'u0',
          'tBasic', 'tOT', 'tAllow', 'tOAllow',
          'tPesangon', 'tOIncome', 'tAbsent',
          'tODeduction', 'tICo', 'tIEmp', 'tTax',
        ],
      }),
    };
  },
  methods: {
    handleExport(c) {
      if (c === 'pdf') this.genPDFSummary();
      else if (c === 'xls') this.genXLSSummary();
    },
    async genPDFSummary() {
      try {
        this.loadPDFSummary = true;
        const y = this.$route.params.id;
        await this.$apollo.mutate({
          mutation: GenPDFSummaryAll,
          variables: {
            id: parseInt(this.$route.params.id, 10),
          },
        });

        this.loadPDFSummary = false;
        window.open(`/summary/${y}/${y}_sum_all.pdf`);
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
    async genXLSSummary() {
      try {
        this.loadXLSSummary = true;
        const y = this.$route.params.id;
        const { data: { genXLSSummaryAll: { sStatus } } } = await this.$apollo.mutate({
          mutation: GenXLSSummaryAll,
          variables: {
            id: parseInt(this.$route.params.id, 10),
          },
        });

        if (sStatus) {
          this.loadXLSSummary = false;
          window.open(`/summary/${y}/${y}_sum_all.xlsx`);
        }
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
  },
  apollo: {
    summaryAll: {
      query: SummaryAll,
      variables() {
        return {
          id: parseInt(this.$route.params.id, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.summaryAll;
          this.items = employee;
          this.miniSearch.addAll(this.items);
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
