<template>
  <div class="space-y-4">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        Home
      </el-breadcrumb-item>
      <el-breadcrumb-item class="text-xl">
        Percentage
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
      v-loading="$apollo.loading"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      :data="category"
      size="small"
      show-summary
      :summary-method="summaries"
    >
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column label="Department" width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="upah" label="Upah" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.upah | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ot" label="OT" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ot | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="percentage" label="Percentage" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.percentage | frac2 }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="Jumlah Karyawan" align="center">
        <el-table-column prop="active" label="Active" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.active }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="finalPay" label="Final Payment" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.finalPay }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column min-width="120"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { PercentageReport } from '../../apollo/query/percentage';
import { GenPDFPercentage, GenXLSPercentage } from '../../apollo/mutation/percentage';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      content: '',
      dir: '',
      category: [],
      loadPercentage: false,
      loadXLSPercentage: false,
    };
  },
  methods: {
    handleExport(c, dir) {
      if (c === 'pdf') this.genPDFPercentage(dir);
      else if (c === 'xls') this.genXLSPercentage(dir);
    },
    async genPDFPercentage(dir) {
      try {
        this.loadPercentage = true;
        await this.$apollo.mutate({
          mutation: GenPDFPercentage,
          variables: {
            id: this.$route.params.id,
          },
        });

        this.loadPercentage = false;
        window.open(`/report/${dir}/${dir}_percentage.pdf`);
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
    async genXLSPercentage(dir) {
      try {
        this.loadXLSPercentage = true;
        const { data: { genXLSPercentage: { sStatus } } } = await this.$apollo.mutate({
          mutation: GenXLSPercentage,
          variables: {
            id: this.$route.params.id,
          },
        });

        if (sStatus) {
          this.loadXLSPercentage = false;
          window.open(`/report/${dir}/${dir}_percentage.xlsx`);
        }
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
  },
  apollo: {
    percentageReport: {
      query: PercentageReport,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const {
            period, year, dir, category,
          } = data.percentageReport;
          this.content = `${period} ${year}`;
          this.dir = dir;
          this.category = category;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
