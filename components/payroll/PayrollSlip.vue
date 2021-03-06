<template>
  <div class="space-y-2">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        Home
      </el-breadcrumb-item>
      <el-breadcrumb-item class="text-xl">
        Slip
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
      <div>
        <el-button
          v-if="$auth.hasRole('guest3')"
          type="primary"
          :loading="loadingGen"
          :disabled="!multipleSelection.length || loadingSend"
          @click="generate"
        >
          Generate
        </el-button>
        <el-button
          v-if="$auth.hasRole('user')"
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
      ref="slipTable"
      v-loading="$apollo.loading"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      size="small"
      height="500"
      border
      :row-class-name="finalRow"
      @select="handleSelect"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="$auth.hasRole('guest3')"
        type="selection"
        width="50"
        align="center"
        :selectable="selectDisable"
      ></el-table-column>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column label="Password" width="100" align="center">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.payPass"
            :disabled="!scope.row.disabled"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100"></el-table-column>
      <el-table-column prop="d0" label="Nama Karyawan" width="300">
        <template slot-scope="scope">
          {{ scope.row.d0 }}
        </template>
      </el-table-column>
      <el-table-column prop="ew0" label="Email" width="300"></el-table-column>
      <el-table-column label="File" width="100">
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.slip.check"
            :href="`/slip/${scope.row.slip.dir}/${scope.row.slip.name}.pdf`"
            target="_blank"
            type="primary"
            class="font-sm"
            :underline="false"
          >
            {{ scope.row.slip.name }}.pdf
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="120"></el-table-column>
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
import { PayrollSlip } from '../../apollo/query/payroll';
import { GenerateSlip, SendSlip } from '../../apollo/mutation/payroll';
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
          '_id', 'd0', 'e0', 'ew0', 'slip',
          'payPass', 'disabled',
        ],
      }),
    };
  },
  methods: {
    selectDisable(r) {
      return r.ew0 !== '';
    },
    handleSelect(v, r) {
      const t = r;
      t.disabled = !t.disabled;
    },
    handleSelectionChange(a) {
      if (a.length) {
        this.multipleSelection = a.map((v) => {
          const t = v;
          t.disabled = true;
          return t;
        });
      } else {
        this.items.map((v) => {
          const t = v;
          t.payPass = true;
          t.disabled = false;
          return t;
        });
        this.multipleSelection = [];
      }
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
              mutation: GenerateSlip,
              variables: {
                id: this.$route.params.id,
                eId: v._id,
                payPass: v.payPass,
              },
              update: (store) => {
                const cdata = store.readQuery({
                  query: PayrollSlip,
                  variables: {
                    id: this.$route.params.id,
                  },
                });
                const index = cdata.payrollSlip.employee.findIndex((e) => e._id === v._id);
                cdata.payrollSlip.employee[index].payPass = true;
                cdata.payrollSlip.employee[index].disabled = false;
                if (cdata.payrollSlip.employee[index].slip.check === false) {
                  cdata.payrollSlip.employee[index].slip.check = true;
                  this.miniSearch.removeAll();
                }
                store.writeQuery({
                  query: PayrollSlip,
                  variables: {
                    id: this.$route.params.id,
                  },
                  data: cdata,
                });
              },
            });
            if (data.generateSlip.sStatus) {
              count += 1;
              this.percentage = Math.floor((count / len) * 100);
            }
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
    async send() {
      try {
        this.loadingSend = true;
        let count = 0;
        const len = this.multipleSelection.length;
        this.percentage = 0;

        await Promise.all(
          this.multipleSelection.map(async (v) => {
            const { data } = await this.$apollo.mutate({
              mutation: SendSlip,
              variables: {
                id: this.$route.params.id,
                eId: v._id,
              },
            });
            if (data.sendSlip.accepted.length) {
              count += 1;
              this.percentage = Math.floor((count / len) * 100);
            }
          }),
        );

        this.loadingSend = false;
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
