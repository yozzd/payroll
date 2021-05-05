<template>
  <div class="space-y-2">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        Home
      </el-breadcrumb-item>
      <el-breadcrumb-item class="text-xl">
        THR List
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
      ref="thrTable"
      v-loading="$apollo.loading || loadPDFThr || loadXLSThr"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      size="small"
      max-height="600"
      border
      show-summary
      :summary-method="summaries"
      :row-class-name="finalRow"
    >
      <el-table-column type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100" fixed></el-table-column>
      <el-table-column prop="d0" label="Nama Karyawan" width="300" fixed></el-table-column>
      <el-table-column prop="h0" label="Status" width="100"></el-table-column>
      <el-table-column label="Hired Date" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.i0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Hari Raya" width="100">
        {{ tglHR }}
      </el-table-column>
      <el-table-column label="Long Service" width="180">
        <template slot-scope="scope">
          {{ scope.row.i0 ? dateDiff(scope.row.i0, tglHR): null }}
        </template>
      </el-table-column>
      <el-table-column label="Birthday" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.o0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" width="180">
        <template slot-scope="scope">
          <p :title="scope.row.ew0" class="truncate">
            {{ scope.row.ew0 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Bank Account" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.t0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Department" width="180">
        <template slot-scope="scope">
          <p :title="scope.row.u0" class="truncate">
            {{ scope.row.u0 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Section" width="180">
        <template slot-scope="scope">
          <p :title="scope.row.v0" class="truncate">
            {{ scope.row.v0 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Position" width="180">
        <template slot-scope="scope">
          <p :title="scope.row.y0" class="truncate">
            {{ scope.row.y0 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="NPWP" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.q0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="THR Prorate" align="center">
        <el-table-column label="Months" width="80" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.bw0 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bx0" label="Amount" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.bx0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="g0" label="Basic Salary" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.g0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Tunjangan Tetap" align="center">
        <el-table-column prop="aj0" label="Living" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.aj0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ak0" label="Perumahan" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ak0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="al0" label="Posisi Fix" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.al0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="am0" label="Fungsional Fix" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.am0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ao0" label="Transport" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ao0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ap0" label="Komunikasi" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ap0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="aq0" label="Expertisi" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.aq0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="as0" label="Posisi Variable" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.as0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="at0" label="Fungsional Var." width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.at0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="au0" label="Acting / PLT" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.au0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="ax0" label="Total Upah" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ax0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ax0F" label="Thr Prorate" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ax0F | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cz0" width="120" align="right">
        <template slot="header">
          <p title="Pajak Penghasilan Ber-NPWP" class="truncate">
            Pajak Penghasilan Ber-NPWP
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.cz0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="da0" width="120" align="right">
        <template slot="header">
          <p title="Pajak Tambahan Non-NPWP" class="truncate">
            Pajak Tambahan Non-NPWP
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.da0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="trfThr" width="120" align="right">
        <template slot="header">
          <p title="Total Thr By Transfer" class="truncate">
            Total Thr By Transfer
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.trfThr | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cshThr" width="120" align="right">
        <template slot="header">
          <p title="Total Thr By Cash" class="truncate">
            Total Thr By Cash
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.cshThr | currency }}</span>
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
import { intervalToDuration } from 'date-fns';
import { PayrollThr } from '../../apollo/query/payroll';
import { GenPDFThr, GenXLSThr } from '../../apollo/mutation/payroll';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      dir: '',
      content: '',
      tglHR: '',
      loadPDFThr: false,
      loadXLSThr: false,
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'h0', 'i0', 'tglHR',
          'bw0', 'bx0', 'g0', 'aj0', 'ak0', 'al0',
          'am0', 'ao0', 'ap0', 'aq0', 'as0', 'at0',
          'au0', 'ax0', 'ax0F', 'cz0', 'da0',
          'trfThr', 'cshThr',
        ],
      }),
    };
  },
  methods: {
    dateDiff(d1, d2) {
      const {
        years, months, days,
      } = intervalToDuration({ start: new Date(d1), end: new Date(d2) });
      return `${years} years ${months} months ${days} days`;
    },
    handleExport(c, dir) {
      if (c === 'pdf') this.genPDFThr(dir);
      else if (c === 'xls') this.genXLSThr(dir);
    },
    async genPDFThr(dir) {
      try {
        this.loadPDFThr = true;
        await this.$apollo.mutate({
          mutation: GenPDFThr,
          variables: {
            id: this.$route.params.id,
          },
        });

        this.loadPDFThr = false;
        window.open(`/report/${dir}/${dir}_thr_list.pdf`);
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
    async genXLSThr(dir) {
      try {
        this.loadXLSThr = true;
        const { data: { genXLSThr: { sStatus } } } = await this.$apollo.mutate({
          mutation: GenXLSThr,
          variables: {
            id: this.$route.params.id,
          },
        });

        if (sStatus) {
          this.loadXLSThr = false;
          window.open(`/report/${dir}/${dir}_thr_list.xlsx`);
        }
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
  },
  apollo: {
    payrollThr: {
      query: PayrollThr,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const {
            dir, period, year, tglHR, employee,
          } = data.payrollThr;
          this.dir = dir;
          this.content = `${period} ${year}`;
          this.items = employee;
          this.tglHR = tglHR;
          this.miniSearch.removeAll();
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
