<template>
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
    </div>
    <el-table
      v-loading="$apollo.loading"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      size="small"
      border
      height="500"
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
      <el-table-column label="Final Payment" width="120" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.ex0">
            X
          </p>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center">
        <template slot="header">
          <p title="Tidak Ikut Pensiun" class="truncate">
            Tidak Ikut Pensiun
          </p>
        </template>
        <template slot-scope="scope">
          <p v-if="scope.row.ey0">
            X
          </p>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center">
        <template slot="header">
          <p title="Tidak Ikut BPJS" class="truncate">
            Tidak Ikut BPJS
          </p>
        </template>
        <template slot-scope="scope">
          <p v-if="scope.row.ez0">
            X
          </p>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center">
        <template slot="header">
          <p title="Tidak Dapat Relaksasi JKK & JK" class="truncate">
            Tidak Dapat Relaksasi JKK & JK
          </p>
        </template>
        <template slot-scope="scope">
          <p v-if="scope.row.fb0">
            X
          </p>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center">
        <template slot="header">
          <p title="Final Payment BPJS Dibayarkan" class="truncate">
            Final Payment BPJS Dibayarkan
          </p>
        </template>
        <template slot-scope="scope">
          <p v-if="scope.row.fj0">
            X
          </p>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center">
        <template slot="header">
          <p title="Special Allowance" class="truncate">
            Special Allowance
          </p>
        </template>
        <template slot-scope="scope">
          <p v-if="scope.row.fl0">
            X
          </p>
        </template>
      </el-table-column>
      <el-table-column min-width="200"></el-table-column>
    </el-table>

    <el-dialog
      title="Flags Employee"
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
            <el-form-item label="Flags">
              <el-checkbox v-model="form.ex0">
                Final Payment
              </el-checkbox>
              <el-checkbox v-model="form.ey0">
                Tidak Ikut Pensiun
              </el-checkbox>
              <el-checkbox v-model="form.ez0">
                Tidak Ikut BPJS
              </el-checkbox>
              <el-checkbox v-model="form.fb0">
                Tidak Dapat Relaksasi JKK & JK
              </el-checkbox>
              <el-checkbox v-model="form.fj0">
                Final Payment BPJS Dibayarkan
              </el-checkbox>
            </el-form-item>
          </div>
          <div class="flex-1 space-y-2">
            <el-checkbox v-model="form.fl0">
              Special Allowance
            </el-checkbox>
            <div class="flex pl-6 items-baseline">
              <div class="w-3/4">
                <el-checkbox
                  v-model="form.am0f"
                  :disabled="!form.fl0"
                >
                  Tj. Tetap Fungsional Fix
                </el-checkbox>
              </div>
              <div class="w-1/4">
                <el-input
                  v-model="form.am0p"
                  size="medium"
                  :disabled="!form.fl0 || !form.am0f"
                ></el-input>
              </div>
            </div>
            <div class="flex pl-6 items-baseline">
              <div class="w-3/4">
                <el-checkbox
                  v-model="form.at0f"
                  :disabled="!form.fl0"
                >
                  Tj. Tetap Fungsional Variable
                </el-checkbox>
              </div>
              <div class="w-1/4">
                <el-input
                  v-model="form.at0p"
                  size="medium"
                  :disabled="!form.fl0 || !form.at0f"
                ></el-input>
              </div>
            </div>
            <div class="flex pl-6 items-baseline">
              <div class="w-3/4">
                <el-checkbox
                  v-model="form.as0f"
                  :disabled="!form.fl0"
                >
                  Tj. Tetap Posisi Variable
                </el-checkbox>
              </div>
              <div class="w-1/4">
                <el-input
                  v-model="form.as0p"
                  size="medium"
                  :disabled="!form.fl0 || !form.as0f"
                ></el-input>
              </div>
            </div>
            <div class="flex pl-6 items-baseline">
              <div class="w-3/4">
                <el-checkbox
                  v-model="form.au0f"
                  :disabled="!form.fl0"
                >
                  Tj. Tetap Acting / PLT
                </el-checkbox>
              </div>
              <div class="w-1/4">
                <el-input
                  v-model="form.au0p"
                  size="medium"
                  :disabled="!form.fl0 || !form.au0f"
                ></el-input>
              </div>
            </div>
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
import { PayrollFlags } from '../../apollo/query/payroll';
import { EditFlagsEmployee } from '../../apollo/mutation/payroll';
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
          '_id', 'd0', 'e0', 'ex0', 'ey0',
          'ez0', 'fb0', 'fj0', 'fl0',
          'am0f', 'am0p', 'as0f', 'as0p',
          'at0f', 'at0p', 'au0f', 'au0p',
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
              mutation: EditFlagsEmployee,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
                    ex0: this.form.ex0,
                    ey0: this.form.ey0,
                    ez0: this.form.ez0,
                    fb0: this.form.fb0,
                    fj0: this.form.fj0,
                    fl0: this.form.fl0,
                    am0f: this.form.am0f,
                    am0p: this.form.am0f ? parseFloat(this.form.am0p) : null,
                    as0f: this.form.as0f,
                    as0p: this.form.as0f ? parseFloat(this.form.as0p) : null,
                    at0f: this.form.at0f,
                    at0p: this.form.at0f ? parseFloat(this.form.at0p) : null,
                    au0f: this.form.au0f,
                    au0p: this.form.au0f ? parseFloat(this.form.au0p) : null,
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
    payrollFlags: {
      query: PayrollFlags,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { freeze, employee } = data.payrollFlags;
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
