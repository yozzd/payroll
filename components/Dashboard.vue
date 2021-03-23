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
              :to="`/payroll/list/${scope.row._id}?t1=a`"
              class="el-link el-link--primary is-underline"
            >
              <i class="el-icon-document"></i>
              <span>
                {{ scope.row.period }}
              </span>
            </nuxt-link>
            <el-menu
              mode="horizontal"
              class="dropmenu"
              @select="(k, p) => handleSelect(k, p, scope.row._id)"
            >
              <el-submenu index="1">
                <el-menu-item index="a">
                  Employment
                </el-menu-item>
                <el-menu-item index="b">
                  Private
                </el-menu-item>
                <el-submenu index="c">
                  <template slot="title">
                    Earnings
                  </template>
                  <el-menu-item index="ca">
                    Basic
                  </el-menu-item>
                  <el-menu-item index="cb">
                    Overtime
                  </el-menu-item>
                  <el-menu-item index="cc">
                    Fixed Allowance
                  </el-menu-item>
                  <el-menu-item index="cd">
                    Non Fixed Allowance
                  </el-menu-item>
                  <el-menu-item index="ce">
                    Retro Fill
                  </el-menu-item>
                  <el-menu-item index="cf">
                    Leave
                  </el-menu-item>
                  <el-menu-item index="cg">
                    Others
                  </el-menu-item>
                </el-submenu>
                <el-submenu index="d">
                  <template slot="title">
                    Deductions
                  </template>
                  <el-menu-item index="da">
                    Absent
                  </el-menu-item>
                  <el-menu-item index="db">
                    Fee
                  </el-menu-item>
                  <el-menu-item index="dc">
                    Tax
                  </el-menu-item>
                  <el-menu-item index="dd">
                    Reduction
                  </el-menu-item>
                  <el-menu-item index="de">
                    Others
                  </el-menu-item>
                </el-submenu>
                <el-menu-item index="e">
                  Payment
                </el-menu-item>
                <el-menu-item index="f">
                  Flags
                </el-menu-item>
                <el-menu-item index="g">
                  Manual
                </el-menu-item>
              </el-submenu>
            </el-menu>
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
                <el-dropdown-item
                  command="kantin"
                  :disabled="scope.row.freeze"
                >
                  Kantin
                </el-dropdown-item>
                <el-dropdown-item
                  command="koperasi"
                  :disabled="scope.row.freeze"
                >
                  Koperasi
                </el-dropdown-item>
                <el-dropdown-item
                  command="overtime"
                  :disabled="scope.row.freeze"
                >
                  OT / Absent
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
                <el-dropdown-item command="a3_pdf">
                  PDF
                </el-dropdown-item>
                <el-dropdown-item command="a3_xls">
                  XLS
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
            <el-dropdown
              trigger="click"
              @command="c => handleActionCommand(c, scope.row._id, scope.row.freeze)"
            >
              <span class="el-dropdown-link">
                Action <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  command="addEmployee"
                  :disabled="scope.row.freeze"
                >
                  Add Employee
                </el-dropdown-item>
                <!--<el-dropdown-item
                  command="cloneEmployee"
                  :disabled="scope.row.freeze"
                >
                  Clone Employee
                </el-dropdown-item>-->
                <el-dropdown-item
                  command="clonePayroll"
                  :disabled="scope.row.freeze"
                >
                  Clone Payroll
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="$auth.hasRole('admin')"
                  divided
                  command="freeze"
                >
                  <span v-if="scope.row.freeze">Unfreeze</span>
                  <span v-else>Freeze</span>
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
      title="Import OT / Absent"
      :visible.sync="showOvertimeDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleOvertimeDialogClose"
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
            :on-change="handleOvertimeUpload"
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
        <el-button @click="handleOvertimeDialogClose">Cancel</el-button>
        <el-button
          type="primary"
          :loading="loadingOvertime"
          @click="handleOvertimeImport('formExt')"
        >
          Import
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Add Employee"
      :visible.sync="showAddEmployeeDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleAddEmployeeDialogClose"
      width="20%"
    >
      <ErrorHandler
        v-if="errors"
        :errors="errors"
        class="mb-8"
      />
      <el-form
        ref="formAddEmployee"
        :model="formAddEmployee"
        :rules="rulesAddEmployee"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="No. Karyawan" prop="e0">
          <el-input
            v-model="formAddEmployee.e0"
            v-maska="'A.####'"
          ></el-input>
        </el-form-item>
        <el-form-item label="Nama Karyawan" prop="d0">
          <el-input
            v-model="formAddEmployee.d0"
          ></el-input>
        </el-form-item>
        <el-form-item label="Gaji Pokok" prop="g0">
          <el-input
            v-model="formAddEmployee.g0"
          ></el-input>
        </el-form-item>
        <el-form-item label="Hari Kerja" prop="j0">
          <el-input
            v-model="formAddEmployee.j0"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddEmployeeDialogClose">Cancel</el-button>
        <el-button
          type="primary"
          :loading="loadingAddEmployee"
          @click="handleAddEmployee('formAddEmployee')"
        >
          Save
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Clone Employee"
      :visible.sync="showCloneEmployeeDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCloneEmployeeDialogClose"
      width="20%"
    >
      <ErrorHandler
        v-if="errors"
        :errors="errors"
        class="mb-8"
      />
      <el-form
        ref="formCloneEmployee"
        :model="formCloneEmployee"
        :rules="rulesCloneEmployee"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="No. Karyawan" prop="e0">
          <el-input
            v-model="formCloneEmployee.e0"
            v-maska="'A.####'"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloneEmployeeDialogClose">Cancel</el-button>
        <el-button
          type="primary"
          :loading="loadingCloneEmployee"
          @click="handleCloneEmployee('formCloneEmployee')"
        >
          Clone
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Clone Payroll"
      :visible.sync="showClonePayrollDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClonePayrollDialogClose"
      width="20%"
    >
      <ErrorHandler
        v-if="errors"
        :errors="errors"
        class="mb-8"
      />
      <el-form
        ref="formClonePayroll"
        :model="formClonePayroll"
        :rules="rulesClonePayroll"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="Period" prop="period">
          <el-date-picker
            v-model="formClonePayroll.period"
            type="daterange"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="dd-MM-yyyy"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClonePayrollDialogClose">Cancel</el-button>
        <el-button
          type="primary"
          :loading="loadingClonePayroll"
          @click="handleClonePayroll('formClonePayroll')"
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
  ImportOvertime,
} from '../apollo/mutation/import';
import {
  PayrollDelete,
  GenerateReportPayroll,
  GeneratePayrollXLS,
  AddEmployee,
  CloneEmployee,
  ClonePayroll,
  PayrollFreeze,
} from '../apollo/mutation/payroll';

export default {
  data() {
    const year = getYear(new Date());
    const initY = 2019;

    return {
      showDialog: false,
      showAddEmployeeDialog: false,
      showCloneEmployeeDialog: false,
      showClonePayrollDialog: false,
      showKantinDialog: false,
      showKoperasiDialog: false,
      showOvertimeDialog: false,
      loading: false,
      loadingAddEmployee: false,
      loadingCloneEmployee: false,
      loadingClonePayroll: false,
      loadingKantin: false,
      loadingKoperasi: false,
      loadingOvertime: false,
      genRpPy: false,
      form: {
        period: [],
        file: null,
        year,
      },
      formAddEmployee: {
        id: '',
        d0: '',
        e0: '',
        g0: '',
        j0: '',
      },
      formCloneEmployee: {
        id: '',
        e0: '',
      },
      formClonePayroll: {
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
      rulesAddEmployee: {
        d0: [{ required: true, message: 'Required' }],
        e0: [{ required: true, message: 'Required' }],
        g0: [{ required: true, message: 'Required' }],
      },
      rulesCloneEmployee: {
        e0: [{ required: true, message: 'Required' }],
      },
      rulesClonePayroll: {
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
    handleSelect(key, keyPath, id) {
      if (keyPath.length > 2) {
        this.$router.push({ name: 'payroll-list-id', params: { id }, query: { t1: keyPath[1], t2: keyPath[2] } });
      } else {
        this.$router.push({ name: 'payroll-list-id', params: { id }, query: { t1: key } });
      }
    },
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
      else if (c === 'overtime') this.handleOvertimeDialog(id);
    },
    handleExportCommand(c, id, dir) {
      if (c === 'a3_pdf') this.generateReportPayroll(id, dir);
      else if (c === 'a3_xls') this.generatePayrollXLS(id, dir);
    },
    handleReportCommand(c, id) {
      if (c === 'journal') this.$router.push({ name: 'payroll-journal-id', params: { id } });
      else if (c === 'tax') this.$router.push({ name: 'payroll-tax-id', params: { id } });
      else if (c === 'ktg') this.$router.push({ name: 'payroll-ketenagakerjaan-id', params: { id } });
      else if (c === 'kes') this.$router.push({ name: 'payroll-kesehatan-id', params: { id } });
      else if (c === 'slip') this.$router.push({ name: 'payroll-slip-id', params: { id } });
    },
    handleActionCommand(c, id, fr) {
      if (c === 'delete') this.handleConfirm(id);
      else if (c === 'addEmployee') this.showAddEmployee(id);
      else if (c === 'cloneEmployee') this.showCloneEmployee(id);
      else if (c === 'clonePayroll') this.showClonePayroll(id);
      else if (c === 'freeze') this.handleFreeze(id, fr);
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
    showAddEmployee(id) {
      this.showAddEmployeeDialog = true;
      this.formAddEmployee.id = id;
    },
    handleAddEmployeeDialogClose() {
      this.$refs.formAddEmployee.resetFields();
      this.$refs.formAddEmployee.clearValidate();
      this.showAddEmployeeDialog = false;
    },
    handleAddEmployee(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingAddEmployee = true;

            await this.$apollo.mutate({
              mutation: AddEmployee,
              variables: {
                input: {
                  _id: this.formAddEmployee.id,
                  d0: this.formAddEmployee.d0,
                  e0: this.formAddEmployee.e0,
                  g0: this.formAddEmployee.g0,
                  j0: this.formAddEmployee.j0,
                },
              },
            });

            this.handleAddEmployeeDialogClose();
            this.loadingAddEmployee = false;
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
    showCloneEmployee(id) {
      this.showCloneEmployeeDialog = true;
      this.formCloneEmployee.id = id;
    },
    handleCloneEmployeeDialogClose() {
      this.$refs.formCloneEmployee.resetFields();
      this.$refs.formCloneEmployee.clearValidate();
      this.showCloneEmployeeDialog = false;
    },
    handleCloneEmployee(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingCloneEmployee = true;

            await this.$apollo.mutate({
              mutation: CloneEmployee,
              variables: {
                input: {
                  _id: this.formCloneEmployee.id,
                  e0: this.formCloneEmployee.e0,
                },
              },
            });

            this.handleCloneEmployeeDialogClose();
            this.loadingCloneEmployee = false;
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
    async generatePayrollXLS(id, dir) {
      try {
        await this.$apollo.mutate({
          mutation: GeneratePayrollXLS,
          variables: {
            id,
          },
        });

        window.open(`/report/${dir}/${dir}_payroll.xls`);
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
    showClonePayroll(id) {
      this.showClonePayrollDialog = true;
      this.formClonePayroll.id = id;
    },
    handleClonePayrollDialogClose() {
      this.$refs.formClonePayroll.resetFields();
      this.$refs.formClonePayroll.clearValidate();
      this.showClonePayrollDialog = false;
    },
    handleClonePayroll(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingClonePayroll = true;

            await this.$apollo.mutate({
              mutation: ClonePayroll,
              variables: {
                input: {
                  _id: this.formClonePayroll.id,
                  from: this.formClonePayroll.period[0],
                  to: this.formClonePayroll.period[1],
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

            this.handleClonePayrollDialogClose();
            this.loadingClonePayroll = false;
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
    handleOvertimeDialog(id) {
      this.showOvertimeDialog = true;
      this.formExt.id = id;
    },
    handleOvertimeDialogClose() {
      this.fileList = [];
      this.$refs.formExt.resetFields();
      this.$refs.formExt.clearValidate();
      this.showOvertimeDialog = false;
    },
    handleOvertimeUpload({ raw }) {
      this.formExt.file = raw;
    },
    handleOvertimeImport(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingOvertime = true;
            const client = this.$apolloProvider.clients.upload;

            await client.mutate({
              mutation: ImportOvertime,
              variables: {
                input: {
                  _id: this.formExt.id,
                  file: this.formExt.file,
                },
              },
            });

            this.handleOvertimeDialogClose();
            this.loadingOvertime = false;
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
    handleFreeze(id, freeze) {
      const f = freeze ? 'Unfreeze' : 'Freeze';
      this.$confirm(`${f} this data?`, 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: PayrollFreeze,
          variables: {
            id,
            freeze,
          },
        });

        this.$message({
          type: 'success',
          message: `${f} completed`,
        });
      }).catch(() => {});
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
