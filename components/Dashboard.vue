<template>
  <div class="flex flex-col space-y-4">
    <div class="flex items-center space-x-8">
      <div>
        <el-link
          :underline="false"
          type="primary"
          icon="el-icon-download"
          @click="showDialog = true"
        >
          Import
        </el-link>
      </div>
      <div class="flex-1"></div>
      <div class="w-32">
        <el-select v-model="form.year" @change="handleChange">
          <el-option
            v-for="year in years"
            :key="year"
            :label="year"
            :value="year"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div>
      <el-table
        v-loading="$apollo.loading || genRpPy"
        :data="payrollAll"
        :element-loading-text="genRpPy ? 'Processing...' : 'Loading...'"
        element-loading-spinner="el-icon-loading"
        height="500"
      >
        <el-table-column
          prop="period"
          label="Period"
          width="200"
        >
          <template slot-scope="scope">
            <nuxt-link
              :to="`/payroll/list/${scope.row._id}`"
              class="el-link el-link--primary is-underline"
            >
              <i class="el-icon-document"></i>
              <span>
                {{ scope.row.period }}
              </span>
            </nuxt-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="year"
          label="Year"
        >
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="c => handleImportCommand(c, scope.row._id)"
            >
              <span class="el-dropdown-link">
                Import <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="kantin">
                  Kantin
                </el-dropdown-item>
                <el-dropdown-item command="koperasi">
                  Koperasi
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="c => handleExportCommand(c, scope.row._id, scope.row.dir)"
            >
              <span class="el-dropdown-link">
                Export <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="pdf">
                  PDF
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="c => handleReportCommand(c, scope.row._id)"
            >
              <span class="el-dropdown-link">
                Report <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="journal">
                  Journal
                </el-dropdown-item>
                <el-dropdown-item command="tax">
                  Tax
                </el-dropdown-item>
                <el-dropdown-item command="ktg">
                  Ketenagakerjaan
                </el-dropdown-item>
                <el-dropdown-item command="kes">
                  Kesehatan
                </el-dropdown-item>
                <el-dropdown-item command="slip">
                  Slip
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column min-width="60">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="c => handleActionCommand(c, scope.row._id)">
              <span class="el-dropdown-link">
                Action <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="cloneEmployee">
                  Clone Employee
                </el-dropdown-item>
                <el-dropdown-item command="clonePayroll">
                  Clone Payroll
                </el-dropdown-item>
                <el-dropdown-item divided command="delete">
                  <span class="text-red-400">Delete</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="Import"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCancel"
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
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="Period" prop="period">
          <el-date-picker
            v-model="form.period"
            type="daterange"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="dd-MM-yyyy"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="File" prop="file">
          <el-upload
            drag
            action=""
            accept=".xls, .xlsx"
            :file-list="fileList"
            :on-change="handleUploadOnChange"
            :auto-upload="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleImport('form')"
        >
          Import
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Import Kantin"
      :visible.sync="showKantinDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleKantinDialogClose"
      width="20%"
    >
      <ErrorHandler
        v-if="errors"
        :errors="errors"
        class="mb-8"
      />
      <el-form
        ref="formExt"
        :model="formExt"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="File" prop="file">
          <el-upload
            drag
            action=""
            accept=".xls, .xlsx"
            :file-list="fileList"
            :on-change="handleKantinUpload"
            :auto-upload="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleKantinDialogClose">Cancel</el-button>
        <el-button
          type="primary"
          :loading="loadingKantin"
          @click="handleKantinImport('formExt')"
        >
          Import
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Import Koperasi"
      :visible.sync="showKoperasiDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleKoperasiDialogClose"
      width="20%"
    >
      <ErrorHandler
        v-if="errors"
        :errors="errors"
        class="mb-8"
      />
      <el-form
        ref="formExt"
        :model="formExt"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="File" prop="file">
          <el-upload
            drag
            action=""
            accept=".xls, .xlsx"
            :file-list="fileList"
            :on-change="handleKoperasiUpload"
            :auto-upload="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleKoperasiDialogClose">Cancel</el-button>
        <el-button
          type="primary"
          :loading="loadingKoperasi"
          @click="handleKoperasiImport('formExt')"
        >
          Import
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Clone Employee"
      :visible.sync="showAddDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleAddDialogClose"
      width="20%"
    >
      <ErrorHandler
        v-if="errors"
        :errors="errors"
        class="mb-8"
      />
      <el-form
        ref="formAdd"
        :model="formAdd"
        :rules="rulesAdd"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="No. Karyawan" prop="e0">
          <el-input
            v-model="formAdd.e0"
            v-maska="'A.####'"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddDialogClose">Cancel</el-button>
        <el-button
          type="primary"
          :loading="loadingAdd"
          @click="handleAdd('formAdd')"
        >
          Save
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Clone Payroll"
      :visible.sync="showCloneDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCloneDialogClose"
      width="20%"
    >
      <ErrorHandler
        v-if="errors"
        :errors="errors"
        class="mb-8"
      />
      <el-form
        ref="formClone"
        :model="formClone"
        :rules="rulesClone"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="Period" prop="period">
          <el-date-picker
            v-model="formClone.period"
            type="daterange"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="dd-MM-yyyy"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloneDialogClose">Cancel</el-button>
        <el-button
          type="primary"
          :loading="loadingClone"
          @click="handleClone('formClone')"
        >
          Clone
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getYear } from 'date-fns';
import { PayrollAll } from '../apollo/query/payroll';
import {
  ImportPayroll,
  ImportKantin,
  ImportKoperasi,
} from '../apollo/mutation/import';
import {
  PayrollDelete,
  GenerateReportPayroll,
  AddEmployee,
  ClonePayroll,
} from '../apollo/mutation/payroll';

export default {
  data() {
    const year = getYear(new Date());
    const initY = 2019;

    return {
      showDialog: false,
      showAddDialog: false,
      showCloneDialog: false,
      showKantinDialog: false,
      showKoperasiDialog: false,
      loading: false,
      loadingAdd: false,
      loadingClone: false,
      loadingKantin: false,
      loadingKoperasi: false,
      genRpPy: false,
      form: {
        period: [],
        file: null,
        year,
      },
      formAdd: {
        id: '',
        e0: '',
      },
      formClone: {
        id: '',
        period: [],
      },
      formExt: {
        id: '',
        file: null,
      },
      fileList: [],
      rules: {
        period: [
          {
            type: 'array',
            required: true,
            message: 'This field is required',
            len: 2,
            fields: {
              0: { type: 'object', required: 'true' },
              1: { type: 'object', required: 'true' },
            },
          },
        ],
        file: [
          {
            type: 'object',
            required: true,
            message: 'This field is required',
          },
        ],
      },
      rulesAdd: {
        e0: [{ required: true, message: 'Required' }],
      },
      rulesClone: {
        period: [
          {
            type: 'array',
            required: true,
            message: 'This field is required',
            len: 2,
            fields: {
              0: { type: 'object', required: 'true' },
              1: { type: 'object', required: 'true' },
            },
          },
        ],
      },
      years: [...Array(year - (initY - 1)).keys()].map((i) => i + initY).sort((a, b) => b - a),
      errors: [],
    };
  },
  methods: {
    handleChange(v) {
      this.form.year = v;
    },
    handleUploadOnChange({ raw }) {
      this.form.file = raw;
    },
    handleCancel() {
      this.fileList = [];
      this.$refs.form.resetFields();
      this.$refs.form.clearValidate();
      this.showDialog = false;
    },
    handleImportCommand(c, id) {
      if (c === 'kantin') this.handleKantinDialog(id);
      else if (c === 'koperasi') this.handleKoperasiDialog(id);
    },
    handleExportCommand(c, id, dir) {
      if (c === 'pdf') this.generateReportPayroll(id, dir);
    },
    handleReportCommand(c, id) {
      if (c === 'journal') this.$router.push({ name: 'payroll-journal-id', params: { id } });
      else if (c === 'tax') this.$router.push({ name: 'payroll-tax-id', params: { id } });
      else if (c === 'ktg') this.$router.push({ name: 'payroll-ketenagakerjaan-id', params: { id } });
      else if (c === 'kes') this.$router.push({ name: 'payroll-kesehatan-id', params: { id } });
      else if (c === 'slip') this.$router.push({ name: 'payroll-slip-id', params: { id } });
    },
    handleActionCommand(c, id) {
      if (c === 'delete') this.handleConfirm(id);
      else if (c === 'cloneEmployee') this.showAdd(id);
      else if (c === 'clonePayroll') this.showClone(id);
    },
    handleConfirm(id) {
      this.$confirm('This will permanently delete the file. Continue?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: PayrollDelete,
          variables: {
            id,
          },
          update: (store, { data: { payrollDelete } }) => {
            const cdata = store.readQuery({
              query: PayrollAll,
              variables: {
                year: this.form.year,
              },
            });
            const index = cdata.payrollAll.findIndex((v) => v._id === payrollDelete._id);
            if (index > -1) {
              cdata.payrollAll.splice(index, 1);
            }
            store.writeQuery({
              query: PayrollAll,
              variables: {
                year: this.form.year,
              },
              data: cdata,
            });
          },
        });

        this.$message({
          type: 'success',
          message: 'Delete completed',
        });
      }).catch(() => {});
    },
    handleImport(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;
            const client = this.$apolloProvider.clients.upload;

            await client.mutate({
              mutation: ImportPayroll,
              variables: {
                input: {
                  file: this.form.file,
                  from: this.form.period[0],
                  to: this.form.period[1],
                },
              },
              update: (store, { data: { importPayroll } }) => {
                const cdata = store.readQuery({
                  query: PayrollAll,
                  variables: {
                    year: this.form.year,
                  },
                });
                cdata.payrollAll.push(importPayroll);
                cdata.payrollAll.sort((a, b) => Number(b.month) - Number(a.month));
                store.writeQuery({
                  query: PayrollAll,
                  variables: {
                    year: this.form.year,
                  },
                  data: cdata,
                });
              },
            });

            this.handleCancel();
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
    showAdd(id) {
      this.showAddDialog = true;
      this.formAdd.id = id;
    },
    handleAddDialogClose() {
      this.$refs.formAdd.resetFields();
      this.$refs.formAdd.clearValidate();
      this.showAddDialog = false;
    },
    handleAdd(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingAdd = true;

            await this.$apollo.mutate({
              mutation: AddEmployee,
              variables: {
                input: {
                  _id: this.formAdd.id,
                  e0: this.formAdd.e0,
                },
              },
            });

            this.handleAddDialogClose();
            this.loadingAdd = false;
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
    async generateReportPayroll(id, dir) {
      try {
        this.genRpPy = true;
        await this.$apollo.mutate({
          mutation: GenerateReportPayroll,
          variables: {
            id,
          },
        });

        this.genRpPy = false;
        window.open(`/report/${dir}/${dir}_payroll.pdf`);
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
    showClone(id) {
      this.showCloneDialog = true;
      this.formClone.id = id;
    },
    handleCloneDialogClose() {
      this.$refs.formClone.resetFields();
      this.$refs.formClone.clearValidate();
      this.showCloneDialog = false;
    },
    handleClone(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingClone = true;

            await this.$apollo.mutate({
              mutation: ClonePayroll,
              variables: {
                input: {
                  _id: this.formClone.id,
                  from: this.formClone.period[0],
                  to: this.formClone.period[1],
                },
              },
              update: (store, { data: { clonePayroll } }) => {
                const cdata = store.readQuery({
                  query: PayrollAll,
                  variables: {
                    year: this.form.year,
                  },
                });
                cdata.payrollAll.push(clonePayroll);
                cdata.payrollAll.sort((a, b) => Number(b.month) - Number(a.month));
                store.writeQuery({
                  query: PayrollAll,
                  variables: {
                    year: this.form.year,
                  },
                  data: cdata,
                });
              },
            });

            this.handleCloneDialogClose();
            this.loadingClone = false;
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
    handleKantinDialog(id) {
      this.showKantinDialog = true;
      this.formExt.id = id;
    },
    handleKantinDialogClose() {
      this.fileList = [];
      this.$refs.formExt.resetFields();
      this.$refs.formExt.clearValidate();
      this.showKantinDialog = false;
    },
    handleKantinUpload({ raw }) {
      this.formExt.file = raw;
    },
    handleKantinImport(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingKantin = true;
            const client = this.$apolloProvider.clients.upload;

            await client.mutate({
              mutation: ImportKantin,
              variables: {
                input: {
                  _id: this.formExt.id,
                  file: this.formExt.file,
                },
              },
            });

            this.handleKantinDialogClose();
            this.loadingKantin = false;
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
    handleKoperasiDialog(id) {
      this.showKoperasiDialog = true;
      this.formExt.id = id;
    },
    handleKoperasiDialogClose() {
      this.fileList = [];
      this.$refs.formExt.resetFields();
      this.$refs.formExt.clearValidate();
      this.showKoperasiDialog = false;
    },
    handleKoperasiUpload({ raw }) {
      this.formExt.file = raw;
    },
    handleKoperasiImport(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingKoperasi = true;
            const client = this.$apolloProvider.clients.upload;

            await client.mutate({
              mutation: ImportKoperasi,
              variables: {
                input: {
                  _id: this.formExt.id,
                  file: this.formExt.file,
                },
              },
            });

            this.handleKoperasiDialogClose();
            this.loadingKoperasi = false;
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
    $client: 'upload',
    payrollAll: {
      query: PayrollAll,
      variables() {
        return {
          year: this.form.year,
        };
      },
      prefetch: false,
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
