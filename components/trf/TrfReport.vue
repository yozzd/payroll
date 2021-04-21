<template>
  <div class="space-y-4">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        Home
      </el-breadcrumb-item>
      <el-breadcrumb-item class="text-xl">
        By Transfer
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flex space-x-4 items-center">
      <div class="flex-1">
        {{ content }}
        &bull; <span class="text-green-500">Total {{ items.length }} items</span>
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
      v-loading="$apollo.loading || loadTrf || loadXLSTrf"
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
      <el-table-column label="Bank No." width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.t0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Bank Name" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.s0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ec0" label="Take Home Pay" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ec0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ec0F" label="THP for Bank" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ec0F | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="120"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { TrfReport } from '../../apollo/query/trf';
import { GenPDFTrf, GenXLSTrf } from '../../apollo/mutation/trf';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      content: '',
      dir: '',
      loadTrf: false,
      loadXLSTrf: false,
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 's0', 't0', 'ec0',
        ],
      }),
    };
  },
  methods: {
    handleExport(c, dir) {
      if (c === 'pdf') this.genPDFTrf(dir);
      else if (c === 'xls') this.genXLSTrf(dir);
    },
    async genPDFTrf(dir) {
      try {
        this.loadTrf = true;
        await this.$apollo.mutate({
          mutation: GenPDFTrf,
          variables: {
            id: this.$route.params.id,
          },
        });

        this.loadTrf = false;
        window.open(`/report/${dir}/${dir}_trf.pdf`);
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
    async genXLSTrf(dir) {
      try {
        this.loadXLSTrf = true;
        const { data: { genXLSTrf: { sStatus } } } = await this.$apollo.mutate({
          mutation: GenXLSTrf,
          variables: {
            id: this.$route.params.id,
          },
        });

        if (sStatus) {
          this.loadXLSTrf = false;
          window.open(`/report/${dir}/${dir}_trf.xls`);
        }
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
  },
  apollo: {
    trfReport: {
      query: TrfReport,
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
          } = data.trfReport;
          this.items = employee;
          this.miniSearch.addAll(this.items);
          this.content = `${period} ${year}`;
          this.dir = dir;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
