<template>
  <div class="flex flex-col space-y-4 mt-4 mb-8 px-12">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        Home
      </el-breadcrumb-item>
      <el-breadcrumb-item class="text-xl">
        Journal
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
          <el-dropdown-item command="xls">
            XLS
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="Balance" name="bal">
        <div v-if="activeName==='bal'">
          <JournalBalance />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Production" name="pro">
        <div v-if="activeName==='pro'">
          <JournalProduction />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Administration" name="adm">
        <div v-if="activeName==='adm'">
          <JournalAdministration />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { PayrollPeriod } from '../../apollo/query/payroll';
import { GenXLSJournal } from '../../apollo/mutation/journal';

export default {
  data() {
    return {
      content: '',
      dir: '',
      activeName: 'bal',
    };
  },
  methods: {
    handleExport(c, dir) {
      if (c === 'xls') this.genXLSJournal(dir);
    },
    async genXLSJournal(dir) {
      try {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
        });
        const { data: { genXLSJournal: { sStatus } } } = await this.$apollo.mutate({
          mutation: GenXLSJournal,
          variables: {
            id: this.$route.params.id,
          },
        });

        if (sStatus) {
          loading.close();
          window.open(`/report/${dir}/${dir}_journal.xlsx`);
        }
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
  },
  apollo: {
    payrollPeriod: {
      query: PayrollPeriod,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { period, year, dir } = data.payrollPeriod;
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
