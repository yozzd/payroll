<template>
  <div class="space-y-2">
    <ErrorHandler
      v-if="errors"
      :errors="errors"
    />
    <div class="flex space-x-4 items-center">
      <div class="flex-1"></div>
      <el-dropdown
        trigger="click"
        @command="c => handleExport(c, dir)"
      >
        <span class="el-dropdown-link">
          Export<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="pdf">
            PDF
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
      <el-table-column label="Department" width="200">
        <template slot-scope="scope">
          <p :title="scope.row.u0" class="truncate">
            {{ scope.row.u0 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Tj. Tetap Fungsional Fix" align="center">
        <el-table-column prop="am0" label="Full" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.am0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="%" width="60" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.am0p }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="am0r" label="Actual" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.am0r | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Tj. Tetap Fungsional Variable" align="center">
        <el-table-column prop="at0" label="Full" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.at0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="%" width="60" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.at0p }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="at0r" label="Actual" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.at0r | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Tj. Tetap Posisi Fix" align="center">
        <el-table-column prop="al0" label="Full" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.al0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="%" width="60" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.al0p }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="al0r" label="Actual" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.al0r | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Tj. Tetap Posisi Variable" align="center">
        <el-table-column prop="as0" label="Full" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.as0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="%" width="60" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.as0p }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="as0r" label="Actual" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.as0r | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Tj. Tetap Acting / PLT" align="center">
        <el-table-column prop="au0" label="Full" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.au0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="%" width="60" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.au0p }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="au0r" label="Actual" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.au0r | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="spAllowRem" label="Keterangan" width="260"></el-table-column>
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
      width="40%"
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
            <el-form-item label="Tj. Tetap Fungsional Fix">
              <el-input v-model="form.am0p"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Fungsional Variable">
              <el-input v-model="form.at0p"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Posisi Fix">
              <el-input v-model="form.al0p"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Posisi Variable">
              <el-input v-model="form.as0p"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Acting / PLT">
              <el-input v-model="form.au0p"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Keterangan">
              <el-input v-model="form.spAllowRem" type="textarea"></el-input>
            </el-form-item>
          </div>
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
import { PayrollSpAllow } from '../../apollo/query/payroll';
import { EditSpAllow, GenPDFSpAllow } from '../../apollo/mutation/payroll';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      showEditDialog: false,
      form: {},
      loadSpAllow: false,
      loading: false,
      dir: '',
      freeze: false,
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'u0', 'fl0',
          'al0', 'al0r', 'al0p',
          'am0', 'am0r', 'am0p',
          'as0', 'as0r', 'as0p',
          'at0', 'at0r', 'at0p',
          'au0', 'au0r', 'au0p',
          'spAllowRem',
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
              mutation: EditSpAllow,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
                    fl0: this.form.fl0,
                    al0p: parseFloat(this.form.al0p),
                    am0p: parseFloat(this.form.am0p),
                    as0p: parseFloat(this.form.as0p),
                    at0p: parseFloat(this.form.at0p),
                    au0p: parseFloat(this.form.au0p),
                    spAllowRem: this.form.spAllowRem,
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
    handleExport(c, dir) {
      if (c === 'pdf') this.genPDFSpAllow(dir);
    },
    async genPDFSpAllow(dir) {
      try {
        this.loadSpAllow = true;
        await this.$apollo.mutate({
          mutation: GenPDFSpAllow,
          variables: {
            id: this.$route.params.id,
          },
        });

        this.loadSpAllow = false;
        window.open(`/report/${dir}/${dir}_sp_allow.pdf`);
        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
  },
  apollo: {
    payrollSpAllow: {
      query: PayrollSpAllow,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { dir, freeze, employee } = data.payrollSpAllow;
          this.dir = dir;
          this.freeze = freeze;
          this.items = employee;
          this.miniSearch.removeAll();
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
