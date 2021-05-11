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
        <div class="flex-1"></div>
        <div class="w-64">
          <el-input
            v-model="search"
            placeholder="Search"
            clearable
          />
        </div>
        <div v-if="!freeze && $auth.hasRole('user')">
          <el-button
            type="primary"
            :loading="loadingGen"
            :disabled="!multipleSelection.length"
            @click="generate"
          >
            Generate
          </el-button>
        </div>
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
          v-if="!freeze && $auth.hasRole('user')"
          type="selection"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column type="index" width="50" align="center" fixed></el-table-column>
        <el-table-column prop="e0" label="No. Karyawan" width="100" fixed></el-table-column>
        <el-table-column label="Nama Karyawan" width="300" fixed>
          <template slot-scope="scope">
            <el-link
              v-if="!freeze && $auth.hasRole('user')"
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
        <el-table-column prop="fDate" width="100">
          <template slot="header">
            <p title="Tanggal Pembuatan Berkas" class="truncate">
              Tanggal Pembuatan Berkas
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

      <el-dialog
        title="Edit Employee"
        :visible.sync="showEditDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="handleEditDialogClose"
        width="80%"
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
          class="flexi flex-col spaxe-y-4"
        >
          <div class="flex space-x-4">
            <div class="flex-1">
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
              <el-form-item label="Basic Salary">
                <el-input v-model="form.g0"></el-input>
              </el-form-item>
              <el-form-item label="Status">
                <el-select v-model="form.h0" filterable>
                  <el-option label="Expat" value="Expat"></el-option>
                  <el-option label="Contract" value="Contract"></el-option>
                  <el-option label="Permanent" value="Permanent"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Hired Date">
                <el-date-picker
                  v-model="form.i0"
                  type="date"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="Hari Kerja">
                <el-input v-model="form.j0"></el-input>
              </el-form-item>
              <el-form-item label="Resign / Finish Date">
                <el-date-picker
                  v-model="form.k0"
                  type="date"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="Position">
                <el-select v-model="form.y0" filterable>
                  <el-option
                    v-for="j in jabatan"
                    :key="j"
                    :label="j"
                    :value="j"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Hour (Lembur Normal)">
                <el-input v-model="form.ab0"></el-input>
              </el-form-item>
              <el-form-item label="Hour (Lembur Dinas)">
                <el-input v-model="form.ad0"></el-input>
              </el-form-item>
              <el-form-item label="Hour (Insentif)">
                <el-input v-model="form.af0"></el-input>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="Tambahan Lain Tidak Kena Pajak">
                <el-input v-model="form.bv0"></el-input>
              </el-form-item>
              <el-form-item label="Months (THR Prorate)">
                <el-input v-model="form.bw0"></el-input>
              </el-form-item>
              <el-form-item label="Cuti (Days)">
                <el-input v-model="form.by0"></el-input>
              </el-form-item>
              <el-form-item label="Absent (Days)">
                <el-input v-model="form.cw0"></el-input>
              </el-form-item>
              <el-form-item label="Pemotongan Toolroom">
                <el-input v-model="form.dh0"></el-input>
              </el-form-item>
              <el-form-item label="Lama Kerja (Uang Pisah)">
                <el-input v-model="form.ds0"></el-input>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="Pesangon">
                <el-input v-model="form.fe0"></el-input>
              </el-form-item>
              <el-form-item label="Dana Pinjaman">
                <el-input v-model="form.dk0"></el-input>
              </el-form-item>
              <el-form-item label="Kanteen">
                <el-input v-model="form.dl0"></el-input>
              </el-form-item>
              <el-form-item label="Kopkar dan BMI">
                <el-input v-model="form.dm0"></el-input>
              </el-form-item>
              <el-form-item label="Pph21 Kurang Bayar">
                <el-input v-model="form.dn0"></el-input>
              </el-form-item>
              <el-form-item label="Pemotongan Lain">
                <el-input v-model="form.di0"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="mt-8 text-lg">
            Tunjangan Tetap
          </div>
          <div class="flex space-x-4">
            <div class="flex-1">
              <el-form-item label="Tj. Tetap Living">
                <el-input v-model="form.aj0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Tetap Perumahan">
                <el-input v-model="form.ak0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Tetap Posisi Fix">
                <el-input v-model="form.al0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Tetap Fungsional Fix">
                <el-input v-model="form.am0r"></el-input>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="Tj. Tetap Koordinator">
                <el-input v-model="form.an0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Tetap Transport">
                <el-input v-model="form.ao0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Tetap Komunikasi">
                <el-input v-model="form.ap0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Tetap Expertisi">
                <el-input v-model="form.aq0r"></el-input>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="Tj. Tetap Honorarium">
                <el-input v-model="form.ar0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Posisi Variable">
                <el-input v-model="form.as0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Fungsional Variable">
                <el-input v-model="form.at0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Tetap Acting / PLT">
                <el-input v-model="form.au0r"></el-input>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="Tj. Others">
                <el-input v-model="form.av0r"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="mt-8 text-lg">
            Tunjangan Tidak Tetap
          </div>
          <div class="flex space-x-4">
            <div class="flex-1">
              <el-form-item label="Tj. Tidak Tetap Fungsional">
                <el-input v-model="form.ba0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Tidak Tetap Shift">
                <el-input v-model="form.bb0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Tidak Tetap Tig Welding">
                <el-input v-model="form.bc0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Tidak Tetap Operator Plasma">
                <el-input v-model="form.bd0r"></el-input>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="Tj. Tidak Tetap LKS">
                <el-input v-model="form.be0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Tidak Tetap Koperasi">
                <el-input v-model="form.bf0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Tidak Tetap Quality System">
                <el-input v-model="form.bg0r"></el-input>
              </el-form-item>
              <el-form-item label="Tj. Tidak Tetap Penghargaan Masa Kerja">
                <el-input v-model="form.bh0r"></el-input>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="Tj. Tidak Tetap Others">
                <el-input v-model="form.bi0r"></el-input>
              </el-form-item>
            </div>
            <div class="flex-1"></div>
          </div>
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
import position from '../../mixins/position';

export default {
  mixins: [mix, position],
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
                    g0: parseInt(this.form.g0, 10),
                    h0: this.form.h0,
                    i0: this.form.i0,
                    j0: parseInt(this.form.j0, 10),
                    k0: this.form.k0,
                    y0: this.form.y0,
                    ab0: parseFloat(this.form.ab0),
                    ad0: parseFloat(this.form.ad0),
                    af0: parseFloat(this.form.af0),
                    bv0: parseInt(this.form.bv0, 10),
                    bw0: parseInt(this.form.bw0, 10),
                    by0: parseFloat(this.form.by0),
                    cw0: parseFloat(this.form.cw0),
                    dh0: parseInt(this.form.dh0, 10),
                    di0: parseInt(this.form.di0, 10),
                    dk0: parseInt(this.form.dk0, 10),
                    dl0: parseInt(this.form.dl0, 10),
                    dm0: parseInt(this.form.dm0, 10),
                    dn0: parseInt(this.form.dn0, 10),
                    ds0: parseInt(this.form.ds0, 10),
                    fe0: parseInt(this.form.fe0, 10),
                    fDate: this.form.fDate,
                    aj0r: parseInt(this.form.aj0r, 10),
                    ak0r: parseInt(this.form.ak0r, 10),
                    al0r: parseInt(this.form.al0r, 10),
                    am0r: parseInt(this.form.am0r, 10),
                    an0r: parseInt(this.form.an0r, 10),
                    ao0r: parseInt(this.form.ao0r, 10),
                    ap0r: parseInt(this.form.ap0r, 10),
                    aq0r: parseInt(this.form.aq0r, 10),
                    ar0r: parseInt(this.form.ar0r, 10),
                    as0r: parseInt(this.form.as0r, 10),
                    at0r: parseInt(this.form.at0r, 10),
                    au0r: parseInt(this.form.au0r, 10),
                    av0r: parseInt(this.form.av0r, 10),
                    ba0r: parseInt(this.form.ba0r, 10),
                    bb0r: parseInt(this.form.bb0r, 10),
                    bc0r: parseInt(this.form.bc0r, 10),
                    bd0r: parseInt(this.form.bd0r, 10),
                    be0r: parseInt(this.form.be0r, 10),
                    bf0r: parseInt(this.form.bf0r, 10),
                    bg0r: parseInt(this.form.bg0r, 10),
                    bh0r: parseInt(this.form.bh0r, 10),
                    bi0r: parseInt(this.form.bi0r, 10),
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
