<template>
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
    </div>
    <el-table
      v-loading="$apollo.loading"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      size="small"
      max-height="500"
      show-summary
      border
      :summary-method="summaries"
      :row-class-name="finalRow"
    >
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
      <el-table-column prop="g0" label="Gaji Pokok" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.g0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="l0"
        label="Gaji Normal"
        width="120"
        align="right"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.l0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ay0" label="Upah Normal" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ay0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Hari Kerja" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.j0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Note" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.m0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aj0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tetap Living" class="truncate">
            Tj. Tetap Living
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.aj0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ak0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tetap Perumahan" class="truncate">
            Tj. Tetap Perumahan
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ak0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="al0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tetap Posisi Fix" class="truncate">
            Tj. Tetap Posisi
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.al0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="am0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tetap Fungsional Fix" class="truncate">
            Tj. Tetap Fungsional
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.am0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="an0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tetap Koordinator" class="truncate">
            Tj. Tetap Koordinator
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.an0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ao0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tetap Transport" class="truncate">
            Tj. Tetap Transport
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ao0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ap0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tetap Komunikasi" class="truncate">
            Tj. Tetap Komunikasi
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ap0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aq0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tetap Expertisi" class="truncate">
            Tj. Tetap Expertisi
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.aq0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ar0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tetap Honorarium" class="truncate">
            Tj. Tetap Honorarium
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ar0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="as0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tetap Posisi Variable" class="truncate">
            Tj. Tetap Posisi Variable
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.as0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="at0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tetap Fungsional Variable" class="truncate">
            Tj. Tetap Fungsional Variable
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.at0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="au0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tetap Acting / PLT" class="truncate">
            Tj. Tetap Acting / PLT
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.au0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="av0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tetap Others" class="truncate">
            Tj. Tetap Others
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.av0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aw0"  min-width="120" align="right">
        <template slot="header">
          <p title="Total Tj. Tetap" class="truncate">
            Total Tj. Tetap
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.aw0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ba0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tidak Tetap Fungsional" class="truncate">
            Tj. Tidak Tetap Fungsional
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ba0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bb0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tidak Tetap Shift" class="truncate">
            Tj. Tidak Tetap Shift
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bb0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bc0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tidak Tetap Tig Welding" class="truncate">
            Tj. Tidak Tetap Tig Welding
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bc0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bd0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tidak Tetap Operator Plasma" class="truncate">
            Tj. Tidak Tetap Operator Plasma
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bd0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="be0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tidak Tetap LKS" class="truncate">
            Tj. Tidak Tetap LKS
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.be0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bf0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tidak Tetap Koperasi" class="truncate">
            Tj. Tidak Tetap Koperasi
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bf0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bg0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tidak Tetap Quality System" class="truncate">
            Tj. Tidak Tetap Quality System
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bg0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bh0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tidak Tetap Penghargaan Masa Kerja" class="truncate">
            Tj. Tidak Tetap Penghargaan Masa Kerja
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bh0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bi0" width="120" align="right">
        <template slot="header">
          <p title="Tj. Tidak Tetap Others" class="truncate">
            Tj. Tidak Tetap Others
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bi0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bj0" width="120" align="right">
        <template slot="header">
          <p title="Total Tj. Tidak Tetap" class="truncate">
            Total Tj. Tidak Tetap
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bj0 | currency }}</span>
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
      >
        <div class="mt-8 text-lg">
          Basic
        </div>
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
            <el-form-item label="Gaji Pokok">
              <el-input v-model="form.g0"></el-input>
            </el-form-item>
            <el-form-item label="Upah Normal">
              <el-input v-model="form.ay0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Hari Kerja">
              <el-input v-model="form.j0"></el-input>
            </el-form-item>
            <el-form-item label="Note">
              <el-input v-model="form.m0" type="textarea"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1"></div>
          <div class="flex-1"></div>
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
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollBasic } from '../../apollo/query/payroll';
import { EditBasic } from '../../apollo/mutation/payroll';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      showEditDialog: false,
      form: {},
      loading: false,
      freeze: false,
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'g0', 'j0', 'l0', 'm0', 'ay0',
          'aj0', 'ak0', 'al0', 'am0', 'an0', 'ao0', 'ap0',
          'aq0', 'ar0', 'as0', 'at0', 'au0', 'av0', 'aw0',
          'aj0r', 'ak0r', 'al0r', 'am0r', 'an0r', 'ao0r',
          'ap0r', 'aq0r', 'ar0r', 'as0r', 'at0r', 'au0r', 'av0r',
          'ba0', 'bb0', 'bc0', 'bd0', 'be0', 'bf0', 'bg0',
          'bh0', 'bi0', 'bj0', 'ba0r', 'bb0r', 'bc0r',
          'bd0r', 'be0r', 'bf0r', 'bg0r', 'bh0r', 'bi0r',
        ],
      }),
    };
  },
  methods: {
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
              mutation: EditBasic,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
                    g0: parseInt(this.form.g0, 10),
                    j0: parseInt(this.form.j0, 10),
                    m0: this.form.m0,
                    ay0: parseInt(this.form.ay0, 10),
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
    payrollBasic: {
      query: PayrollBasic,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { freeze, employee } = data.payrollBasic;
          this.freeze = freeze;
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
