<template>
  <div class="space-y-2">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        Home
      </el-breadcrumb-item>
      <el-breadcrumb-item class="text-xl">
        Slip Thr
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flex space-x-4 items-center">
      <div class="flex-1">
        {{ content }}
        &bull; <span class="text-pink-500">{{ multipleSelection.length }} item(s) selected</span>
      </div>
      <div class="w-64">
        <el-input
          v-model="search"
          placeholder="Search"
          clearable
        />
      </div>
      <div v-if="$auth.hasRole('user')">
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
    </div>
    <el-progress
      :text-inside="true"
      :stroke-width="16"
      :percentage="percentage"
    ></el-progress>
    <ErrorHandler
      v-if="errors"
      :errors="errors"
    />
    <el-table
      ref="thrTable"
      v-loading="$apollo.loading"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      size="small"
      height="500"
      border
      :row-class-name="finalRow"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="$auth.hasRole('user')"
        type="selection"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100"></el-table-column>
      <el-table-column prop="d0" label="Nama Karyawan" width="300">
        <template slot-scope="scope">
          <p>
            {{ scope.row.d0 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="File" width="100">
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.thr.check"
            :href="`/thrSlip/${scope.row.thr.dir}/${scope.row.thr.name}.pdf`"
            target="_blank"
            type="primary"
            class="font-sm"
            :underline="false"
          >
            {{ scope.row.thr.name }}.pdf
          </el-link>
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
import { PayrollThr } from '../../apollo/query/payroll';
import { GenThrSlip, SendThrSlip } from '../../apollo/mutation/payroll';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      content: '',
      multipleSelection: [],
      loadingGen: false,
      loadingSend: false,
      percentage: 0,
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'thr',
        ],
      }),
    };
  },
  methods: {
    handleSelectionChange(a) {
      this.multipleSelection = a.map((v) => v._id);
    },
    async generate() {
      try {
        this.loadingGen = true;
        let count = 0;
        const len = this.multipleSelection.length;
        this.percentage = 0;

        await Promise.all(
          this.multipleSelection.map(async (v) => {
            const { data } = await this.$apollo.mutate({
              mutation: GenThrSlip,
              variables: {
                id: this.$route.params.id,
                eId: v,
              },
              update: (store) => {
                const cdata = store.readQuery({
                  query: PayrollThr,
                  variables: {
                    id: this.$route.params.id,
                  },
                });
                const index = cdata.payrollThr.employee.findIndex((e) => e._id === v);
                if (cdata.payrollThr.employee[index].thr.check === false) {
                  cdata.payrollThr.employee[index].thr.check = true;
                  this.miniSearch.removeAll();
                }
                store.writeQuery({
                  query: PayrollThr,
                  variables: {
                    id: this.$route.params.id,
                  },
                  data: cdata,
                });
              },
            });
            if (data.genThrSlip.sStatus) {
              count += 1;
              this.percentage = Math.floor((count / len) * 100);
            }
          }),
        );

        this.loadingGen = false;
        this.multipleSelection = [];
        this.$refs.thrTable.clearSelection();
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
    async send() {
      try {
        this.loadingSend = true;
        let count = 0;
        const len = this.multipleSelection.length;
        this.percentage = 0;

        await Promise.all(
          this.multipleSelection.map(async (v) => {
            const { data } = await this.$apollo.mutate({
              mutation: SendThrSlip,
              variables: {
                id: this.$route.params.id,
                eId: v,
              },
            });
            if (data.sendThrSlip.accepted.length) {
              count += 1;
              this.percentage = Math.floor((count / len) * 100);
            }
          }),
        );

        this.loadingSend = false;
        this.multipleSelection = [];
        this.$refs.thrTable.clearSelection();
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
          const { period, year, employee } = data.payrollThr;
          this.content = `${period} ${year}`;
          this.items = employee;
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
