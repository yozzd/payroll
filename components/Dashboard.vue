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
        v-loading="$apollo.loading || genRpPy || genAcc"
        :data="payrollAll"
        :element-loading-text="genRpPy || genAcc ? 'Processing...' : 'Loading...'"
        element-loading-spinner="el-icon-loading"
        height="600"
      >
        <el-table-column
          prop="period"
          label="Period"
          width="200"
        >
          <template slot-scope="scope">
            <nuxt-link
              :to="`/payroll/list/${scope.row._id}?t1=a`"
              class="el-link el-link--primary -mr-4"
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
                <el-menu-item index="h">
                  Final Payment
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
            <el-menu
              mode="horizontal"
              class="dropmenu"
              @select="c => handleImportCommand(c, scope.row._id)"
            >
              <el-submenu index="1">
                <template slot="title">
                  Import
                </template>
                <el-menu-item
                  index="a"
                  :disabled="scope.row.freeze"
                >
                  Kantin
                </el-menu-item>
                <el-menu-item
                  index="b"
                  :disabled="scope.row.freeze"
                >
                  Koperasi
                </el-menu-item>
                <el-menu-item
                  index="c"
                  :disabled="scope.row.freeze"
                >
                  OT / Absent
                </el-menu-item>
                <el-menu-item
                  index="d"
                  :disabled="scope.row.freeze"
                >
                  Tax 21 Kurang / Lebih Bayar
                </el-menu-item>
                <el-menu-item
                  index="e"
                  :disabled="scope.row.freeze"
                >
                  Agama
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-menu
              mode="horizontal"
              class="dropmenu"
              @select="c => handleExportCommand(c, scope.row._id, scope.row.dir)"
            >
              <el-submenu index="1">
                <template slot="title">
                  Export
                </template>
                <el-submenu index="a">
                  <template slot="title">
                    Payroll
                  </template>
                  <el-menu-item index="aa">
                    PDF
                  </el-menu-item>
                  <el-menu-item
                    v-if="$auth.hasRole('admin')"
                    index="ab"
                  >
                    XLS
                  </el-menu-item>
                  <el-menu-item
                    v-if="$auth.hasRole('admin')"
                    index="ac"
                  >
                    XLS (No Final Payment)
                  </el-menu-item>
                </el-submenu>
                <el-menu-item index="b">
                  Accounting Check
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-menu
              mode="horizontal"
              class="dropmenu"
              @select="c => handleReportCommand(c, scope.row._id)"
            >
              <el-submenu index="1">
                <template slot="title">
                  Report
                </template>
                <el-menu-item index="a">
                  Journal
                </el-menu-item>
                <el-menu-item index="b">
                  Tax
                </el-menu-item>
                <el-menu-item index="c">
                  Ketenagakerjaan
                </el-menu-item>
                <el-menu-item index="d">
                  Kesehatan
                </el-menu-item>
                <el-menu-item index="e">
                  By Transfer
                </el-menu-item>
                <el-menu-item index="f">
                  Pph21
                </el-menu-item>
                <el-menu-item index="g">
                  Slip
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </template>
        </el-table-column>
        <el-table-column min-width="60">
          <template slot-scope="scope">
            <el-menu
              mode="horizontal"
              class="dropmenu"
              @select="c => handleActionCommand(c, scope.row)"
            >
              <el-submenu index="1">
                <template slot="title">
                  Action
                </template>
                <el-menu-item
                  index="a"
                  :disabled="scope.row.freeze"
                >
                  Add Employee
                </el-menu-item>
                <el-menu-item
                  v-if="$auth.hasRole('admin')"
                  index="b"
                  :disabled="scope.row.freeze"
                >
                  Clone Payroll
                </el-menu-item>
                <el-menu-item
                  index="c"
                  :disabled="scope.row.freeze"
                >
                  Hari Raya
                </el-menu-item>
                <el-menu-item
                  v-if="$auth.hasRole('admin')"
                  index="d"
                >
                  <span v-if="scope.row.freeze">Unfreeze</span>
                  <span v-else>Freeze</span>
                </el-menu-item>
                <el-menu-item index="e">
                  <span class="text-red-400">Delete</span>
                </el-menu-item>
              </el-submenu>
            </el-menu>
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
      title="Import Tax 21 Kurang / Lebih Bayar"
      :visible.sync="showTax21Dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleTax21DialogClose"
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
            :on-change="handleTax21Upload"
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
        <el-button @click="handleTax21DialogClose">Cancel</el-button>
        <el-button
          type="primary"
          :loading="loadingTax21"
          @click="handleTax21Import('formExt')"
        >
          Import
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Import Agama"
      :visible.sync="showAgamaDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleAgamaDialogClose"
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
            :on-change="handleAgamaUpload"
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
        <el-button @click="handleAgamaDialogClose">Cancel</el-button>
        <el-button
          type="primary"
          :loading="loadingAgama"
          @click="handleAgamaImport('formExt')"
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
      width="80%"
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
        <div class="flex space-x-4">
          <div class="flex-1">
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
          </div>
          <div class="flex-1">
            <el-form-item label="Jenis Kelamin" prop="n0">
              <el-select v-model="formAddEmployee.n0" filterable>
                <el-option label="Female" value="Female"></el-option>
                <el-option label="Male" value="Male"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Birthday" prop="o0">
              <el-date-picker
                v-model="formAddEmployee.o0"
                type="date"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Status (NPWP)" prop="p0">
              <el-select v-model="formAddEmployee.p0" filterable>
                <el-option label="No" value="No"></el-option>
                <el-option label="Yes" value="Yes"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Status Tanggungan (NPWP)" prop="r0">
              <el-select v-model="formAddEmployee.r0" filterable>
                <el-option label="K/0" value="K/0"></el-option>
                <el-option label="K/1" value="K/1"></el-option>
                <el-option label="K/2" value="K/2"></el-option>
                <el-option label="K/3" value="K/3"></el-option>
                <el-option label="TK/0" value="TK/0"></el-option>
                <el-option label="TK/1" value="TK/1"></el-option>
                <el-option label="TK/2" value="TK/2"></el-option>
                <el-option label="TK/3" value="TK/3"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Status Karyawan" prop="h0">
              <el-select v-model="formAddEmployee.h0" filterable>
                <el-option label="Expat" value="Expat"></el-option>
                <el-option label="Contract" value="Contract"></el-option>
                <el-option label="Permanent" value="Permanent"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Hired Date" prop="i0">
              <el-date-picker
                v-model="formAddEmployee.i0"
                type="date"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Resign / Finish Date">
              <el-date-picker
                v-model="formAddEmployee.k0"
                type="date"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Upah untuk Pelaporan BPJS Kesehatan" prop="co0">
              <el-input v-model="formAddEmployee.co0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Department" prop="u0">
              <el-select v-model="formAddEmployee.u0" filterable>
                <el-option
                  v-for="d in dpt"
                  :key="d"
                  :label="d"
                  :value="d"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Section" prop="v0">
              <el-select v-model="formAddEmployee.v0" filterable>
                <el-option
                  v-for="s in sct"
                  :key="s"
                  :label="s"
                  :value="s"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Email" prop="ew0">
              <el-input v-model="formAddEmployee.ew0"></el-input>
            </el-form-item>
          </div>
        </div>
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

    <el-dialog
      title="Hari Raya"
      :visible.sync="showHariRayaDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleHariRayaDialogClose"
      width="20%"
    >
      <ErrorHandler
        v-if="errors"
        :errors="errors"
        class="mb-8"
      />
      <el-form
        ref="formHariRaya"
        :model="formHariRaya"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="Type">
          <el-select v-model="formHariRaya.typeHR" filterable>
            <el-option label="None" value="0"></el-option>
            <el-option label="Muslim" value="1"></el-option>
            <el-option label="Non Muslim" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Tanggal">
          <el-date-picker
            v-model="formHariRaya.tglHR"
            type="date"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleHariRayaDialogClose">Cancel</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleHariRaya('formHariRaya')"
        >
          Update
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
  ImportTax21,
  ImportAgama,
} from '../apollo/mutation/import';
import {
  PayrollDelete,
  GenerateReportPayroll,
  GeneratePayrollXLS,
  GenPayrollXLSNoFin,
  GenerateAccCheck,
  AddEmployee,
  CloneEmployee,
  ClonePayroll,
  HariRaya,
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
      showHariRayaDialog: false,
      showKantinDialog: false,
      showKoperasiDialog: false,
      showOvertimeDialog: false,
      showTax21Dialog: false,
      showAgamaDialog: false,
      loading: false,
      loadingAddEmployee: false,
      loadingCloneEmployee: false,
      loadingClonePayroll: false,
      loadingHariRaya: false,
      loadingKantin: false,
      loadingKoperasi: false,
      loadingOvertime: false,
      loadingTax21: false,
      loadingAgama: false,
      genRpPy: false,
      genAcc: false,
      dpt: [],
      sct: [],
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
        h0: '',
        i0: '',
        j0: '',
        k0: '',
        n0: '',
        o0: '',
        p0: '',
        r0: '',
        u0: '',
        v0: '',
        co0: '',
        ew0: '',
      },
      formCloneEmployee: {
        id: '',
        e0: '',
      },
      formClonePayroll: {
        id: '',
        period: [],
      },
      formHariRaya: {
        id: '',
        typeHR: '',
        tglHR: '',
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
        h0: [{ required: true, message: 'Required', trigger: 'change' }],
        i0: [{ required: true, message: 'Required' }],
        g0: [{ required: true, message: 'Required' }],
        j0: [{ required: true, message: 'Required' }],
        n0: [{ required: true, message: 'Required', trigger: 'change' }],
        o0: [{ required: true, message: 'Required' }],
        p0: [{ required: true, message: 'Required', trigger: 'change' }],
        r0: [{ required: true, message: 'Required', trigger: 'change' }],
        u0: [{ required: true, message: 'Required', trigger: 'change' }],
        v0: [{ required: true, message: 'Required', trigger: 'change' }],
        co0: [{ required: true, message: 'Required' }],
        ew0: [{ required: true, message: 'Required' }],
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
      } else if (key === 'h') {
        this.$router.push({ name: 'payroll-final-id', params: { id } });
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
      if (c === 'a') this.handleKantinDialog(id);
      else if (c === 'b') this.handleKoperasiDialog(id);
      else if (c === 'c') this.handleOvertimeDialog(id);
      else if (c === 'd') this.handleTax21Dialog(id);
      else if (c === 'e') this.handleAgamaDialog(id);
    },
    handleExportCommand(c, id, dir) {
      if (c === 'aa') this.generateReportPayroll(id, dir);
      else if (c === 'ab') this.generatePayrollXLS(id, dir);
      else if (c === 'ac') this.genPayrollXLSNoFin(id, dir);
      else if (c === 'b') this.generateAccCheck(id, dir);
    },
    handleReportCommand(c, id) {
      if (c === 'a') this.$router.push({ name: 'payroll-journal-id', params: { id } });
      else if (c === 'b') this.$router.push({ name: 'payroll-tax-id', params: { id } });
      else if (c === 'c') this.$router.push({ name: 'payroll-ketenagakerjaan-id', params: { id } });
      else if (c === 'd') this.$router.push({ name: 'payroll-kesehatan-id', params: { id } });
      else if (c === 'e') this.$router.push({ name: 'payroll-trf-id', params: { id } });
      else if (c === 'f') this.$router.push({ name: 'payroll-pph-id', params: { id } });
      else if (c === 'g') this.$router.push({ name: 'payroll-slip-id', params: { id } });
    },
    handleActionCommand(c, r) {
      const {
        _id, freeze, typeHR, tglHR,
      } = r;
      if (c === 'a') this.showAddEmployee(_id);
      else if (c === 'b') this.showClonePayroll(_id);
      else if (c === 'c') this.showHariRaya(_id, typeHR, tglHR);
      else if (c === 'd') this.handleFreeze(_id, freeze);
      else if (c === 'e') this.handleConfirm(_id);
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
                  h0: this.formAddEmployee.h0,
                  i0: this.formAddEmployee.i0,
                  j0: parseInt(this.formAddEmployee.j0, 10),
                  k0: this.formAddEmployee.k0,
                  n0: this.formAddEmployee.n0,
                  o0: this.formAddEmployee.o0,
                  p0: this.formAddEmployee.p0,
                  r0: this.formAddEmployee.r0,
                  u0: this.formAddEmployee.u0,
                  v0: this.formAddEmployee.v0,
                  co0: parseInt(this.formAddEmployee.co0, 10),
                  ew0: this.formAddEmployee.ew0,
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
    async genPayrollXLSNoFin(id, dir) {
      try {
        await this.$apollo.mutate({
          mutation: GenPayrollXLSNoFin,
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
    async generateAccCheck(id, dir) {
      try {
        this.genAcc = true;
        await this.$apollo.mutate({
          mutation: GenerateAccCheck,
          variables: {
            id,
          },
        });

        this.genAcc = false;
        window.open(`/report/${dir}/${dir}_acc.pdf`);
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
    showHariRaya(id, typeHR, tglHR) {
      this.showHariRayaDialog = true;
      this.formHariRaya.id = id;
      this.formHariRaya.typeHR = typeHR.toString();
      this.formHariRaya.tglHR = tglHR;
    },
    handleHariRayaDialogClose() {
      this.$refs.formHariRaya.resetFields();
      this.$refs.formHariRaya.clearValidate();
      this.showHariRayaDialog = false;
    },
    handleHariRaya(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingHariRaya = true;

            await this.$apollo.mutate({
              mutation: HariRaya,
              variables: {
                id: this.formHariRaya.id,
                typeHR: parseInt(this.formHariRaya.typeHR, 10),
                tglHR: this.formHariRaya.tglHR,
              },
            });

            this.handleHariRayaDialogClose();
            this.loadingHariRaya = false;
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
    handleTax21Dialog(id) {
      this.showTax21Dialog = true;
      this.formExt.id = id;
    },
    handleTax21DialogClose() {
      this.fileList = [];
      this.$refs.formExt.resetFields();
      this.$refs.formExt.clearValidate();
      this.showTax21Dialog = false;
    },
    handleTax21Upload({ raw }) {
      this.formExt.file = raw;
    },
    handleTax21Import(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingTax21 = true;
            const client = this.$apolloProvider.clients.upload;

            await client.mutate({
              mutation: ImportTax21,
              variables: {
                input: {
                  _id: this.formExt.id,
                  file: this.formExt.file,
                },
              },
            });

            this.handleTax21DialogClose();
            this.loadingTax21 = false;
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
    handleAgamaDialog(id) {
      this.showAgamaDialog = true;
      this.formExt.id = id;
    },
    handleAgamaDialogClose() {
      this.fileList = [];
      this.$refs.formExt.resetFields();
      this.$refs.formExt.clearValidate();
      this.showAgamaDialog = false;
    },
    handleAgamaUpload({ raw }) {
      this.formExt.file = raw;
    },
    handleAgamaImport(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingAgama = true;
            const client = this.$apolloProvider.clients.upload;

            await client.mutate({
              mutation: ImportAgama,
              variables: {
                input: {
                  _id: this.formExt.id,
                  file: this.formExt.file,
                },
              },
            });

            this.handleAgamaDialogClose();
            this.loadingAgama = false;
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
      result({ data, loading }) {
        if (!loading) {
          const len = data.payrollAll.length;
          const { employee } = data.payrollAll[len - 1];
          this.dpt = [...new Set(employee.map((v) => v.u0))].sort();
          this.sct = [...new Set(employee.map((v) => v.v0))].sort();
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
