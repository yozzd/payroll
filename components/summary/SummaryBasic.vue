<template>
  <div class="space-y-4">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        Home
      </el-breadcrumb-item>
      <el-breadcrumb-item class="text-xl">
        Summary Basic
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
      <el-table-column label="January" prop="jan" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.jan | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="February" prop="feb" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.feb | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="March" prop="mar" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.mar | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="April" prop="apr" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.apr | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="May" prop="mei" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.mei | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="June" prop="jun" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.jun | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="July" prop="jul" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.jul | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="August" prop="agu" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.agu | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="September" prop="sep" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.sep | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="October" prop="okt" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.okt | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="November" prop="nov" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.nov | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="December" prop="des" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.des | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Total" prop="tBasic" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.tBasic | currency }}</span>
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
import { SummaryBasic } from '../../apollo/query/summary';
import { GenPDFSummaryBasic, GenXLSSummaryBasic } from '../../apollo/mutation/summary';
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
          'jan', 'feb', 'mar', 'apr', 'mei', 'jun',
          'jul', 'agu', 'sep', 'okt', 'nov', 'des', 'tBasic',
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
          mutation: GenPDFSummaryBasic,
          variables: {
            id: parseInt(this.$route.params.id, 10),
          },
        });

        this.loadPDFSummary = false;
        window.open(`/summary/${y}/${y}_sum_basic.pdf`);
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
        const { data: { genXLSSummaryBasic: { sStatus } } } = await this.$apollo.mutate({
          mutation: GenXLSSummaryBasic,
          variables: {
            id: parseInt(this.$route.params.id, 10),
          },
        });

        if (sStatus) {
          this.loadXLSSummary = false;
          window.open(`/summary/${y}/${y}_sum_basic.xlsx`);
        }
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
  },
  apollo: {
    summaryBasic: {
      query: SummaryBasic,
      variables() {
        return {
          id: parseInt(this.$route.params.id, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.summaryBasic;
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
