<template>
  <div class="space-y-4">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        Home
      </el-breadcrumb-item>
      <el-breadcrumb-item class="text-xl">
        Summary Tax Ready Paid
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
      <el-table-column label="January" align="center">
        <el-table-column label="DTP" prop="jan1" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.jan1 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Non DTP" prop="jan2" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.jan2 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="February" align="center">
        <el-table-column label="DTP" prop="feb1" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.feb1 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Non DTP" prop="feb2" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.feb2 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="March" align="center">
        <el-table-column label="DTP" prop="mar1" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.mar1 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Non DTP" prop="mar2" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.mar2 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="April" align="center">
        <el-table-column label="DTP" prop="apr1" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.apr1 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Non DTP" prop="apr2" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.apr2 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="May" align="center">
        <el-table-column label="DTP" prop="mei1" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.mei1 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Non DTP" prop="mei2" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.mei2 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="June" align="center">
        <el-table-column label="DTP" prop="jun1" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.jun1 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Non DTP" prop="jun2" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.jun2 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="July" align="center">
        <el-table-column label="DTP" prop="jul1" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.jul1 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Non DTP" prop="jul2" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.jul2 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="August" align="center">
        <el-table-column label="DTP" prop="agu1" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.agu1 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Non DTP" prop="agu2" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.agu2 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="September" align="center">
        <el-table-column label="DTP" prop="sep1" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.sep1 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Non DTP" prop="sep2" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.sep2 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="October" align="center">
        <el-table-column label="DTP" prop="okt1" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.okt1 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Non DTP" prop="okt2" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.okt2 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="November" align="center">
        <el-table-column label="DTP" prop="nov1" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.nov1 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Non DTP" prop="nov2" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.nov2 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="December" align="center">
        <el-table-column label="DTP" prop="des1" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.des1 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Non DTP" prop="des2" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.des2 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Total" align="center">
        <el-table-column label="DTP" prop="tTax1" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.tTax1 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Non DTP" prop="tTax2" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.tTax2 | currency }}</span>
          </template>
        </el-table-column>
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
import { SummaryTax } from '../../apollo/query/summary';
import { GenPDFSummaryTax, GenXLSSummaryTax } from '../../apollo/mutation/summary';
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
          'jan1', 'feb1', 'mar1', 'apr1', 'mei1', 'jun1',
          'jul1', 'agu1', 'sep1', 'okt1', 'nov1', 'des1', 'tTax1',
          'jan2', 'feb2', 'mar2', 'apr2', 'mei2', 'jun2',
          'jul2', 'agu2', 'sep2', 'okt2', 'nov2', 'des2', 'tTax2',
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
          mutation: GenPDFSummaryTax,
          variables: {
            id: parseInt(this.$route.params.id, 10),
          },
        });

        this.loadPDFSummary = false;
        window.open(`/summary/${y}/${y}_sum_tax.pdf`);
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
        const { data: { genXLSSummaryTax: { sStatus } } } = await this.$apollo.mutate({
          mutation: GenXLSSummaryTax,
          variables: {
            id: parseInt(this.$route.params.id, 10),
          },
        });

        if (sStatus) {
          this.loadXLSSummary = false;
          window.open(`/summary/${y}/${y}_sum_tax.xlsx`);
        }
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
  },
  apollo: {
    summaryTax: {
      query: SummaryTax,
      variables() {
        return {
          id: parseInt(this.$route.params.id, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.summaryTax;
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
