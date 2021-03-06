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
          :disabled="loadingSend || loadingSlip"
          clearable
        />
      </div>
      <el-button
        type="primary"
        :loading="loadingSlip"
        :disabled="!multipleSelection.length || loadingSend"
        @click="generate"
      >
        Generate
      </el-button>
      <el-button
        type="primary"
        :loading="loadingSend"
        :disabled="!multipleSelection.length || loadingSlip"
        @click="send"
      >
        Send
      </el-button>
    </div>
    <div>
      <el-table
        ref="eslipTable"
        v-loading="$apollo.loading || loadingSlip || loadingSend"
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
              {{ scope.row.h0 }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="File" min-width="200">
          <template slot-scope="scope">
            <el-link
              v-if="scope.row.slipPath"
              :href="scope.row.slipPath"
              target="_blank"
              type="primary"
              class="link-sm"
            >
              {{ scope.row._id }}.pdf
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { EmployeeESlip } from '../../apollo/query/eslip';
import { GenerateESlip, SendESlip } from '../../apollo/mutation/eslip';

export default {
  data() {
    return {
      content: '',
      items: [],
      loadingSlip: false,
      loadingSend: false,
      multipleSelection: [],
      percentage: 0,
      search: '',
      headerCol: '',
      errors: [],
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['b0', 'c0', 'h0'],
        storeFields: ['_id', 'b0', 'c0', 'h0', 'slipPath'],
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
      this.$router.push({ path: '/eslip/' });
    },
    selectDisable(r) {
      return r.h0 !== '';
    },
    handleSelectionChange(a) {
      this.multipleSelection = a.map((v) => v._id);
    },
    handleChange(e, { column }) {
      if (e) this.headerCol = column.property;
    },
    async generate() {
      try {
        this.loadingSlip = true;
        let count = 0;
        this.percentage = 0;

        await Promise.all(
          this.multipleSelection.map(async (v) => {
            const { data } = await this.$apollo.mutate({
              mutation: GenerateESlip,
              variables: {
                id: this.$route.params.id,
                eId: v,
              },
              update: (store, { data: { generateESlip } }) => {
                const cdata = store.readQuery({
                  query: EmployeeESlip,
                  variables: {
                    id: this.$route.params.id,
                  },
                });
                const index = cdata.employeeESlip.employee.findIndex((e) => e._id === v);
                if (cdata.employeeESlip.employee[index].slipPath) {
                  cdata.employeeESlip.employee[index].slip.check = generateESlip.slipPath;
                  this.miniSearch.removeAll();
                }
                store.writeQuery({
                  query: EmployeeESlip,
                  variables: {
                    id: this.$route.params.id,
                  },
                  data: cdata,
                });
              },
            });
            if (data.generateESlip.sStatus) {
              count += 1;
              this.percentage = Math.round((count / this.multipleSelection.length) * 100);
            }
          }),
        );

        this.loadingSlip = false;
        this.multipleSelection = [];
        this.$refs.eslipTable.clearSelection();
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
        this.percentage = 0;

        await Promise.all(
          this.multipleSelection.map(async (v) => {
            const { data } = await this.$apollo.mutate({
              mutation: SendESlip,
              variables: {
                id: this.$route.params.id,
                eId: v,
              },
            });
            if (data.sendESlip.accepted.length) {
              count += 1;
              this.percentage = Math.round((count / this.multipleSelection.length) * 100);
            }
          }),
        );

        this.loadingSend = false;
        this.multipleSelection = [];
        this.$refs.eslipTable.clearSelection();
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
    employeeESlip: {
      query: EmployeeESlip,
      prefetch: false,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      result({ data, loading }) {
        if (!loading) {
          const { employee, period, year } = data.employeeESlip;
          this.items = employee;
          this.content = `${period} ${year}`;
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
