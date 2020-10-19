<template>
  <div class="space-y-2">
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
      <el-button
        type="primary"
        :loading="loadingGen"
        :disabled="!multipleSelection.length || loadingSend"
        @click="generate"
      >
        Generate
      </el-button>
      <el-button
        type="primary"
        :loading="loadingSend"
        :disabled="!multipleSelection.length || loadingGen"
        @click="send"
      >
        Send
      </el-button>
    </div>
    <el-table
      ref="slipTable"
      v-loading="$apollo.loading"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      size="small"
      height="600"
      :row-class-name="finalRow"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
        :selectable="selectDisable"
      ></el-table-column>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100"></el-table-column>
      <el-table-column prop="d0" label="Nama Karyawan" width="200">
        <template slot-scope="scope">
          <client-only>
            <p v-snip="1" :title="scope.row.d0">
              {{ scope.row.d0 }}
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="ew0" label="Email" min-width="300"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollSlip } from '../../apollo/query/payroll';
import { GenerateSlip } from '../../apollo/mutation/payroll';

export default {
  data() {
    return {
      content: '',
      items: [],
      search: '',
      multipleSelection: [],
      loadingGen: false,
      loadingSend: false,
      errors: [],
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'ew0',
        ],
      }),
    };
  },
  computed: {
    tableData() {
      if (this.search) {
        return this.miniSearch.search(this.search, { prefix: true });
      }
      return this.items;
    },
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/dashboard/' });
    },
    finalRow({ row }) {
      if (row.ex0 === 1) {
        return 'final-row';
      }
      return '';
    },
    selectDisable(r) {
      return r.ew0 !== '';
    },
    handleSelectionChange(a) {
      this.multipleSelection = a.map((v) => v._id);
    },
    async generate() {
      try {
        this.loadingGen = true;

        await Promise.all(
          this.multipleSelection.map(async (v) => {
            const { data } = await this.$apollo.mutate({
              mutation: GenerateSlip,
              variables: {
                id: this.$route.params.id,
                eId: v,
              },
            });
          }),
        );

        this.loadingGen = false;
        this.multipleSelection = [];
        this.$refs.slipTable.clearSelection();
        this.$message({
          type: 'success',
          message: 'Completed',
        });

        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
    send() {},
  },
  apollo: {
    payrollSlip: {
      query: PayrollSlip,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { period, year, employee } = data.payrollSlip;
          this.content = `${period} ${year}`;
          this.items = employee;
          this.miniSearch.addAll(this.items);
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>