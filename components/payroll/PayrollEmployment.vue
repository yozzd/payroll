<template>
  <div class="space-y-2">
    <div class="flex space-x-4 items-center">
      <div class="flex-1">
        <span class="text-pink-500">{{ multipleSelection.length }} item(s) selected</span>
      </div>
      <div v-if="!freeze && $auth.hasRole('user')">
        <el-link
          type="primary"
          :underline="false"
          :disabled="!multipleSelection.length"
          @click="handleDelete"
        >
          Delete
        </el-link>
      </div>
      <div class="w-64">
        <el-input
          v-model="search"
          placeholder="Search"
          clearable
        />
      </div>
    </div>
    <ErrorHandler
      v-if="errors"
      :errors="errors"
    />
    <el-table
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
        width="40"
        align="center"
        fixed
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
      <el-table-column prop="h0" label="Status Karyawan" width="120"></el-table-column>
      <el-table-column prop="i0" label="Hired Date" width="100"></el-table-column>
      <el-table-column prop="k0" width="100">
        <template slot="header">
          <p title="Resign / Finish Date" class="truncate">
            Resign / Finish Date
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="u0" label="Department" width="280"></el-table-column>
      <el-table-column prop="v0" label="Section" width="280"></el-table-column>
      <el-table-column prop="w0" label="Section Code" width="100"></el-table-column>
      <el-table-column prop="x0" label="Grade" width="100"></el-table-column>
      <el-table-column prop="y0" label="Jabatan" width="200"></el-table-column>
      <el-table-column min-width="120"></el-table-column>
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
      width="60%"
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
              <el-input v-model="form.e0"></el-input>
            </el-form-item>
            <el-form-item label="Nama Karyawan">
              <el-input v-model="form.d0"></el-input>
            </el-form-item>
            <el-form-item label="Status Karyawan">
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
            <el-form-item label="Resign / Finish Date">
              <el-date-picker
                v-model="form.k0"
                type="date"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Department">
              <el-select v-model="form.u0" filterable>
                <el-option
                  v-for="d in department"
                  :key="d"
                  :label="d"
                  :value="d"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Section">
              <el-select v-model="form.v0" filterable>
                <el-option
                  v-for="s in section"
                  :key="s"
                  :label="s"
                  :value="s"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Section Code">
              <el-select v-model="form.w0" filterable>
                <el-option
                  v-for="s in sectionCode"
                  :key="s"
                  :label="s"
                  :value="s"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Grade">
              <el-select v-model="form.x0" filterable>
                <el-option
                  v-for="g in grade"
                  :key="g"
                  :label="g"
                  :value="g"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Jabatan">
              <el-select v-model="form.y0" filterable>
                <el-option
                  v-for="j in jabatan"
                  :key="j"
                  :label="j"
                  :value="j"
                ></el-option>
              </el-select>
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
import pullAllBy from 'lodash/pullAllBy';
import MiniSearch from 'minisearch';
import { PayrollEmployment } from '../../apollo/query/payroll';
import { EditEmployment, EmployeeDelete } from '../../apollo/mutation/payroll';
import mix from '../../mixins/payroll';
import position from '../../mixins/position';

export default {
  mixins: [mix, position],
  data() {
    return {
      currentPage: 1,
      showEditDialog: false,
      form: {},
      loading: false,
      freeze: false,
      multipleSelection: [],
      cachedMultipleSelection: [],
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'h0', 'i0', 'k0',
          'u0', 'v0', 'w0', 'x0', 'y0',
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
              mutation: EditEmployment,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
                    d0: this.form.d0,
                    e0: this.form.e0,
                    h0: this.form.h0,
                    i0: this.form.i0,
                    k0: this.form.k0,
                    u0: this.form.u0,
                    v0: this.form.v0,
                    w0: this.form.w0,
                    x0: this.form.x0,
                    y0: this.form.y0,
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
    handleSelectionChange(arr) {
      this.multipleSelection = arr.map((v) => ({ _id: v._id }));
      this.cachedMultipleSelection = arr;
    },
    handleDelete() {
      this.$confirm('This will permanently delete the data. Continue?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: EmployeeDelete,
          variables: {
            id: this.$route.params.id,
            del: this.multipleSelection,
          },
          update: (store, { data: { employeeDelete } }) => {
            const cdata = store.readQuery({
              query: PayrollEmployment,
              variables: {
                id: this.$route.params.id,
              },
            });
            pullAllBy(cdata.payrollEmployment.employee, employeeDelete, '_id');
            store.writeQuery({
              query: PayrollEmployment,
              variables: {
                id: this.$route.params.id,
              },
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            employeeDelete: this.cachedMultipleSelection,
          },
        });

        this.$message({
          type: 'success',
          message: 'Delete completed',
        });
      }).catch(() => {});
    },
  },
  apollo: {
    payrollEmployment: {
      query: PayrollEmployment,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { freeze, employee } = data.payrollEmployment;
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
