<template>
  <div class="space-y-2">
    <ErrorHandler
      v-if="errors"
      :errors="errors"
    />
    <div class="flex space-x-4 items-center">
      <div class="flex-1"></div>
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
      border
      show-summary
      :summary-method="summaries"
    >
      <el-table-column type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100" fixed></el-table-column>
      <el-table-column prop="d0" label="Nama Karyawan" width="300" fixed></el-table-column>
      <el-table-column prop="y0" label="Position" width="200"></el-table-column>
      <el-table-column prop="u0" label="Department" width="280"></el-table-column>
      <el-table-column label="Section" width="280">
        <template slot-scope="scope">
          <p :title="scope.row.v0" class="truncate">
            {{ scope.row.v0 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="w0" label="Code" width="80" align="center"></el-table-column>
      <el-table-column prop="l0" label="Basic" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.l0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cy0" label="Absen" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.cy0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="df0" label="Other Deduction" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.df0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ai0" label="OT" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ai0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ef0" width="120" align="right">
        <template slot="header">
          <p title="Position / Functional" class="truncate">
            Position / Functional
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ef0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="eg0" label="Housing" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.eg0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="eh0" label="Transport" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.eh0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ei0" label="Incentive" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ei0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ej0" label="Meals" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ej0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ek0" label="Living" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ek0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="el0" label="Communication" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.el0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="em0" width="120" align="right">
        <template slot="header">
          <p title="Other Allowance Taxable" class="truncate">
            Other Allowance Taxable
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.em0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bu0" label="Retro" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.bu0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cb0" label="Accident" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.cb0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cc0" label="Death" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.cc0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80" align="center">
        <template slot="header">
          <p title="Kelas Rawat" class="truncate">
            Kelas Rawat
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.cs0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cq0" label="Kelas I" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.cq0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cg0" label="Old Ins" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.cg0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="eo0" label="Serv" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.eo0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bx0" label="THR" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.bx0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bv0" width="120" align="right">
        <template slot="header">
          <p title="Lebih Bayar Pph21" class="truncate">
            Lebih Bayar Pph21
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bv0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="es0" min-width="120" align="right">
        <template slot="header">
          <p title="Pengembalian Pajak DTP" class="truncate">
            Pengembalian Pajak DTP
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.es0 | currency }}</span>
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
import { JournalAdministration } from '../../apollo/query/journal';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'l0', 'u0', 'v0', 'w0', 'y0',
          'ai0', 'bu0', 'bv0', 'bx0', 'cb0', 'cc0', 'cg0',
          'cq0', 'cs0', 'cy0', 'df0', 'ef0', 'eg0', 'eh0',
          'ei0', 'ej0', 'ek0', 'el0', 'em0', 'eo0', 'es0',
        ],
      }),
    };
  },
  apollo: {
    journalAdministration: {
      query: JournalAdministration,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employeeA } = data.journalAdministration;
          this.items = employeeA;
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
