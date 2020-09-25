<template>
  <div class="flex flex-col space-y-4 mt-4 mb-8 px-12">
    <BreadNav :breadcrumb="breadcrumb" />
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
      <el-button
        type="primary"
        :loading="loadingSlip"
        :disabled="!multipleSelection.length"
        @click="generate"
      >
        Generate
      </el-button>
      <el-button
        type="primary"
        :loading="loadingSend"
        :disabled="!multipleSelection.length"
        @click="send"
      >
        Send
      </el-button>
    </div>
    <el-table
      ref="eslipTable"
      v-loading="$apollo.loading || loadingSlip || loadingSend"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      size="small"
      max-height="500"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
        :selectable="selectDisable"
      ></el-table-column>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="b0">
        <template slot="header" slot-scope="scope">
          <div class="flex">
            <div class="flex-1">
              No. Karyawan
            </div>
            <el-dropdown
              trigger="click"
              @visible-change="e => handleChange(e, scope)"
            >
              <i class="el-icon-search"></i>
              <el-dropdown-menu slot="dropdown">
                <el-input
                  v-model="search"
                  placeholder="Search"
                />
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
        <template slot-scope="scope">
          <span>
            {{ scope.row.b0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="c0">
        <template slot="header" slot-scope="scope">
          <div class="flex">
            <div class="flex-1">
              Nama Karyawan
            </div>
            <el-dropdown
              trigger="click"
              @visible-change="e => handleChange(e, scope)"
            >
              <i class="el-icon-search"></i>
              <el-dropdown-menu slot="dropdown">
                <el-input
                  v-model="search"
                  placeholder="Search"
                />
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
        <template slot-scope="scope">
          <span>
            {{ scope.row.c0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="h0">
        <template slot="header" slot-scope="scope">
          <div class="flex">
            <div class="flex-1">
              Email
            </div>
            <el-dropdown
              trigger="click"
              @visible-change="e => handleChange(e, scope)"
            >
              <i class="el-icon-search"></i>
              <el-dropdown-menu slot="dropdown">
                <el-input
                  v-model="search"
                  placeholder="Search"
                />
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
        <template slot-scope="scope">
          <span>
            {{ scope.row.h0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="E-Slip">
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.slipPath"
            :href="scope.row.slipPath"
            target="_blank"
            class="link-sm"
          >
            {{ scope.row._id }}.pdf
          </el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { EmployeeESlip } from '../../apollo/query/eslip';
import { GenerateESlip, SendESlip } from '../../apollo/mutation/eslip';

export default {
  data() {
    return {
      breadcrumb: [],
      items: [],
      loadingSlip: false,
      loadingSend: false,
      multipleSelection: [],
      percentage: 0,
      search: '',
      headerCol: '',
      errors: [],
    };
  },
  computed: {
    tableData() {
      if (this.headerCol) {
        return this.items.filter((data) => !this.search
        || data[this.headerCol].toLowerCase().includes(this.search.toLowerCase()));
      }
      return this.items;
    },
  },
  methods: {
    selectDisable(r) {
      return r.h0 !== '';
    },
    handleSelectionChange(a) {
      this.multipleSelection = a.map((v) => v._id);
    },
    handleChange(e, { column }) {
      if (e) {
        this.headerCol = column.property;
      } else {
        this.headerCol = '';
        this.search = '';
      }
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
                cdata.employeeESlip.employee[index].slipPath = generateESlip.slipPath;
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
        this.errors = graphQLErrors.length ? graphQLErrors : networkError.result.errors;
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
        this.errors = graphQLErrors.length ? graphQLErrors : networkError.result.errors;
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

          this.breadcrumb = [
            { name: 'E-Slip', path: '/eslip' },
            { name: `${period} ${year}` },
          ];
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors.length ? graphQLErrors : networkError.result.errors;
      },
    },
  },
};
</script>
