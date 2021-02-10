<template>
  <div class="space-y-2">
    <ErrorHandler
      v-if="errors"
      :errors="errors"
    />
    <div class="flex space-x-4 items-center">
      <div class="flex-1">
        Total {{ items.length }} items
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
      <el-table-column label="Nama Karyawan" width="200" fixed>
        <template slot-scope="scope">
          <client-only>
            <el-link
              type="primary"
              class="font-sm"
              @click="showEdit(scope.row)"
            >
              <p v-snip="1" :title="scope.row.d0">
                {{ scope.row.d0 }}
              </p>
            </el-link>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column label="Final Payment" width="100" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.ex0" >
            X
          </p>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tidak Ikut Pensiun">
              Tidak Ikut Pensiun
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <p v-if="scope.row.ey0" >
            X
          </p>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tidak Ikut BPJS">
              Tidak Ikut BPJS
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <p v-if="scope.row.ez0" >
            X
          </p>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tidak Dapat Relaksasi JKK & JK">
              Tidak Dapat Relaksasi JKK & JK
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <p v-if="scope.row.fb0" >
            X
          </p>
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
      width="31%"
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
        <el-form-item label="Flags">
          <el-checkbox v-model="form.ex0">Final Payment</el-checkbox>
          <el-checkbox v-model="form.ey0">Tidak Ikut Pensiun</el-checkbox>
          <el-checkbox v-model="form.ez0">Tidak Ikut BPJS</el-checkbox>
          <el-checkbox v-model="form.fb0">Tidak Dapat Relaksasi JKK & JK</el-checkbox>
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
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'ex0', 'ey0',
          'ez0', 'fb0',
        ],
      }),
    };
  },
  methods: {
    showEdit(row) {
      this.showEditDialog = true;
      this.form = row;
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
          const { employee } = data.payrollFlags;
          this.items = employee;
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
