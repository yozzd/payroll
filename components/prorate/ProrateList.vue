<template>
  <div class="flex flex-col space-y-4 mt-4 mb-8 px-12">
    <el-page-header :content="content" @back="goBack">
    </el-page-header>
    <el-progress
      :text-inside="true"
      :stroke-width="16"
      :percentage="percentage"
    ></el-progress>
    <ErrorHandler
      v-if="errors"
      :errors="errors"
    />
    <div class="flex space-x-4 items-center">
      <div class="flex-1">
        {{ multipleSelection.length }} item(s) selected
      </div>
      <div class="w-64">
        <el-input
          v-model="search"
          placeholder="Search"
          :disabled="loadingSend || loadingGen"
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
        v-if="$auth.hasRole('admin')"
        type="primary"
        :loading="loadingSend"
        :disabled="!multipleSelection.length || loadingGen"
        @click="send"
      >
        Send
      </el-button>
    </div>
    <div>
      <el-table
        ref="prorateTable"
        v-loading="$apollo.loading || loadingGen || loadingSend"
        element-loading-text="Loading..."
        element-loading-spinner="el-icon-loading"
        :data="tableData"
        size="small"
        height="500"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
          align="center"
          :selectable="selectDisable"
        ></el-table-column>
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="b0" label="No. Karyawan" width="100"></el-table-column>
        <el-table-column label="Nama Karyawan" width="300">
          <template slot-scope="scope">
            <p>
              {{ scope.row.c0 }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="Email" width="300">
          <template slot-scope="scope">
            <p>
              {{ scope.row.e0 }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="File" min-width="200">
          <template slot-scope="scope">
            <el-link
              v-if="scope.row.slip.check"
              :href="`/prorate/${scope.row.slip.dir}/${scope.row.slip.name}.pdf`"
              target="_blank"
              type="primary"
              class="font-sm"
            >
              {{ scope.row.slip.name }}.pdf
            </el-link>
          </template>
        </el-table-column>
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
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { EmployeeProrate } from '../../apollo/query/prorate';
import { GenerateProrate, SendProrate } from '../../apollo/mutation/prorate';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      content: '',
      loadingGen: false,
      loadingSend: false,
      multipleSelection: [],
      percentage: 0,
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['b0', 'c0', 'e0'],
        storeFields: ['_id', 'b0', 'c0', 'e0', 'slip'],
      }),
    };
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/prorate/' });
    },
    selectDisable(r) {
      return r.e0 !== '';
    },
    handleSelectionChange(a) {
      this.multipleSelection = a.map((v) => v._id);
    },
    handleChange(e, { column }) {
      if (e) this.headerCol = column.property;
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
              mutation: GenerateProrate,
              variables: {
                id: this.$route.params.id,
                eId: v,
              },
              update: (store) => {
                const cdata = store.readQuery({
                  query: EmployeeProrate,
                  variables: {
                    id: this.$route.params.id,
                  },
                });
                const index = cdata.employeeProrate.employee.findIndex((e) => e._id === v);
                if (cdata.employeeProrate.employee[index].slip.check === false) {
                  cdata.employeeProrate.employee[index].slip.check = true;
                  this.miniSearch.removeAll();
                }
                store.writeQuery({
                  query: EmployeeProrate,
                  variables: {
                    id: this.$route.params.id,
                  },
                  data: cdata,
                });
              },
            });
            if (data.generateProrate.sStatus) {
              count += 1;
              this.percentage = Math.floor((count / len) * 100);
            }
          }),
        );

        this.loadingGen = false;
        this.multipleSelection = [];
        this.$refs.prorateTable.clearSelection();
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
              mutation: SendProrate,
              variables: {
                id: this.$route.params.id,
                eId: v,
              },
            });
            if (data.sendProrate.accepted.length) {
              count += 1;
              this.percentage = Math.floor((count / len) * 100);
            }
          }),
        );

        this.loadingSend = false;
        this.multipleSelection = [];
        this.$refs.prorateTable.clearSelection();
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
    employeeProrate: {
      query: EmployeeProrate,
      prefetch: false,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      result({ data, loading }) {
        if (!loading) {
          const { employee, period, year } = data.employeeProrate;
          this.items = employee;
          this.content = `${period} ${year}`;
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
