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
      <el-table-column prop="h0" label="Status Karyawan" width="120"></el-table-column>
      <el-table-column prop="i0" label="Hired Date" width="100"></el-table-column>
      <el-table-column prop="k0" width="100">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Resign / Finish Contract Date">
              Resign / Finish Contract Date
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column label="Department" width="200">
        <template slot-scope="scope">
          <client-only>
            <p v-snip="1" :title="scope.row.u0">
              {{ scope.row.u0 }}
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column label="Section" width="200">
        <template slot-scope="scope">
          <client-only>
            <p v-snip="1" :title="scope.row.v0">
              {{ scope.row.v0 }}
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="w0" label="Section Code" width="100"></el-table-column>
      <el-table-column prop="x0" label="Grade" width="100"></el-table-column>
      <el-table-column prop="y0" label="Jabatan" min-width="200"></el-table-column>
    </el-table>

    <el-dialog
      title="Edit Employee"
      :visible.sync="showEditDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleEditDialogClose"
      width="30%"
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
            <el-form-item label="Status Karyawan" filterable>
              <el-select v-model="form.h0">
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
            <el-form-item label="Resign / Finish Date">
              <el-date-picker
                v-model="form.k0"
                type="date"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Department">
              <el-select v-model="form.u0" filterable>
                <el-option
                  v-for="d in dpt"
                  :key="d"
                  :label="d"
                  :value="d"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Section">
              <el-select v-model="form.v0" filterable>
                <el-option
                  v-for="s in sct"
                  :key="s"
                  :label="s"
                  :value="s"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Section Code">
              <el-select v-model="form.w0" filterable>
                <el-option
                  v-for="s in scd"
                  :key="s"
                  :label="s"
                  :value="s"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Grade">
              <el-select v-model="form.x0" filterable>
                <el-option
                  v-for="g in grd"
                  :key="g"
                  :label="g"
                  :value="g"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Jabatan">
              <el-select v-model="form.y0" filterable>
                <el-option
                  v-for="j in jbt"
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
import MiniSearch from 'minisearch';
import { PayrollEmployment } from '../../apollo/query/payroll';
import { EditEmployment } from '../../apollo/mutation/payroll';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      showEditDialog: false,
      form: {},
      loading: false,
      dpt: [],
      sct: [],
      scd: [],
      grd: [],
      jbt: [],
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
          const { employee } = data.payrollEmployment;
          this.items = employee;
          this.miniSearch.addAll(this.items);
          this.dpt = [...new Set(this.items.map((v) => v.u0))].sort();
          this.sct = [...new Set(this.items.map((v) => v.v0))].sort();
          this.scd = [...new Set(this.items.map((v) => v.w0))].sort();
          this.grd = [...new Set(this.items.map((v) => v.x0))].sort();
          this.jbt = [...new Set(this.items.map((v) => v.y0))].sort();
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
