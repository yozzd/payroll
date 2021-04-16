<template>
  <div class="flex flex-col space-y-4 mt-4 mb-8 px-12">
    <el-page-header :content="content" @back="goBack">
    </el-page-header>
    <div class="space-y-2">
      <ErrorHandler
        v-if="errors"
        :errors="errors"
      />
      <div class="flex space-x-4 items-center">
        <div class="flex-1">
          <span class="text-green-500">Total {{ items.length }} items</span>
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
          :disabled="!multipleSelection.length"
          @click="generate"
        >
          Generate
        </el-button>
      </div>
      <el-progress
        :text-inside="true"
        :stroke-width="16"
        :percentage="percentage"
      ></el-progress>
      <el-table
        ref="finalTable"
        v-loading="$apollo.loading"
        element-loading-text="Loading..."
        element-loading-spinner="el-icon-loading"
        :data="tableData"
        size="small"
        border
        height="500"
        :row-class-name="finalRow"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column type="index" width="50" align="center" fixed></el-table-column>
        <el-table-column prop="e0" label="No. Karyawan" width="100" fixed></el-table-column>
        <el-table-column label="Nama Karyawan" width="300" fixed>
          <template slot-scope="scope">
            <el-link
              v-if="!freeze"
              type="primary"
              class="font-sm"
              :underline="false"
              @click="showEdit(scope.row)"
            >
              <p>
                {{ scope.row.d0 }}
              </p>
            </el-link>
            <p v-else>
              {{ scope.row.d0 }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="File" width="200">
          <template slot-scope="scope">
            <el-link
              v-if="scope.row.final.check"
              :href="`/final/${scope.row.final.dir}/${scope.row.final.name}.pdf`"
              target="_blank"
              type="primary"
              class="font-sm"
              :underline="false"
            >
              {{ scope.row.final.name }}.pdf
            </el-link>
          </template>
        </el-table-column>
        <el-table-column min-width="200"></el-table-column>
      </el-table>

      <el-dialog
        title="Edit Employee"
        :visible.sync="showEditDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="handleEditDialogClose"
        width="20%"
      >
        <ErrorHandler
          v-if="errors"
          :errors="errors"
          class="mb-8"
        />
        <el-form
          ref="form"
          :model="form"
          :hide-required-asterisk="true"
          label-position="top"
        >
          <el-form-item label="No. Karyawan">
            <el-input
              v-model="form.e0"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="Nama Karyawan">
            <el-input
              v-model="form.d0"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="Tanggal Pembuatan Berkas">
            <el-date-picker
              v-model="form.fDate"
              type="date"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleEditDialogClose">Cancel</el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleEdit('form')"
          >
            Update
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollFinal } from '../../apollo/query/payroll';
import { GenerateFinal, EditFinalEmployee } from '../../apollo/mutation/payroll';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      content: '',
      multipleSelection: [],
      loadingGen: false,
      showEditDialog: false,
      form: {},
      loading: false,
      freeze: false,
      percentage: 0,
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'final',
        ],
      }),
    };
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/dashboard/' });
    },
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
              mutation: GenerateFinal,
              variables: {
                id: this.$route.params.id,
                eId: v,
              },
              update: (store) => {
                const cdata = store.readQuery({
                  query: PayrollFinal,
                  variables: {
                    id: this.$route.params.id,
                  },
                });
                const index = cdata.payrollFinal.employee.findIndex((e) => e._id === v);
                if (cdata.payrollFinal.employee[index].final.check === false) {
                  cdata.payrollFinal.employee[index].final.check = true;
                  this.miniSearch.removeAll();
                }
                store.writeQuery({
                  query: PayrollFinal,
                  variables: {
                    id: this.$route.params.id,
                  },
                  data: cdata,
                });
              },
            });
            if (data.generateFinal.sStatus) {
              count += 1;
              this.percentage = Math.floor((count / len) * 100);
            }
          }),
        );

        this.loadingGen = false;
        this.multipleSelection = [];
        this.$refs.finalTable.clearSelection();
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
    showEdit(row) {
      this.showEditDialog = true;
      this.form = { ...row };
    },
    handleEditDialogClose() {
      this.$refs.form.resetFields();
      this.showEditDialog = false;
    },
    handleEdit(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;

            await this.$apollo.mutate({
              mutation: EditFinalEmployee,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
                    fDate: this.form.fDate,
                  },
                },
              },
            });

            this.handleEditDialogClose();
            this.loading = false;
            return true;
          } catch ({ graphQLErrors, networkError }) {
            this.errors = graphQLErrors || networkError.result.errors;
            return false;
          }
        } else {
          return false;
        }
      });
    },
  },
  apollo: {
    payrollFinal: {
      query: PayrollFinal,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const {
            freeze, employee, period, year,
          } = data.payrollFinal;
          this.freeze = freeze;
          this.items = employee;
          this.miniSearch.removeAll();
          this.miniSearch.addAll(this.items);
          this.content = `${period} ${year}`;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
