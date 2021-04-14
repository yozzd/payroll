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
      height="500"
      :row-class-name="finalRow"
    >
      <el-table-column type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100" fixed></el-table-column>
      <el-table-column label="Nama Karyawan" width="300" fixed>
        <template slot-scope="scope">
          <el-link
            v-if="!freeze"
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
      <el-table-column prop="n0" label="Jenis Kelamin" width="100"></el-table-column>
      <el-table-column prop="o0" label="Birthday" width="100"></el-table-column>
      <el-table-column label="NPWP" align="center">
        <el-table-column prop="p0" label="Status" width="80"></el-table-column>
        <el-table-column prop="q0" label="No." width="160"></el-table-column>
        <el-table-column prop="r0" label="Status Tanggungan" width="140"></el-table-column>
      </el-table-column>
      <el-table-column label="Bank" align="center">
        <el-table-column prop="s0" label="Name" width="100"></el-table-column>
        <el-table-column prop="t0" label="No." width="160"></el-table-column>
      </el-table-column>
      <el-table-column label="BPJS" align="center">
        <el-table-column prop="z0" label="Ketenagakerjaan" width="160"></el-table-column>
        <el-table-column prop="aa0" label="Kesehatan" width="160"></el-table-column>
      </el-table-column>
      <el-table-column prop="et0" label="Agama" width="160"></el-table-column>
      <el-table-column prop="ew0" label="Email" min-width="240"></el-table-column>
      <el-table-column label="" min-width="120"></el-table-column>
    </el-table>

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
            <el-form-item label="Jenis Kelamin">
              <el-select v-model="form.n0" filterable>
                <el-option label="Female" value="Female"></el-option>
                <el-option label="Male" value="Male"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Birthday">
              <el-date-picker
                v-model="form.o0"
                type="date"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Status (NPWP)">
              <el-select v-model="form.p0" filterable>
                <el-option label="No" value="No"></el-option>
                <el-option label="Yes" value="Yes"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="No. (NPWP)">
              <el-input v-model="form.q0"></el-input>
            </el-form-item>
            <el-form-item label="Status Tanggungan (NPWP)">
              <el-select v-model="form.r0" filterable>
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
            <el-form-item label="Name (Bank)">
              <el-select v-model="form.s0" filterable>
                <el-option
                  v-for="v in banks"
                  :key="v"
                  :label="v"
                  :value="v"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="No. Rekening (Bank)">
              <el-input v-model="form.t0"></el-input>
            </el-form-item>
            <el-form-item label="Ketenagakerjaan (BPJS)">
              <el-input v-model="form.z0"></el-input>
            </el-form-item>
            <el-form-item label="Kesehatan (BPJS)">
              <el-input v-model="form.aa0"></el-input>
            </el-form-item>
            <el-form-item label="Email">
              <el-input v-model="form.ew0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Agama">
              <el-select v-model="form.et0" filterable>
                <el-option
                  v-for="v in rlg"
                  :key="v"
                  :label="v"
                  :value="v"
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
import { PayrollPrivate } from '../../apollo/query/payroll';
import { EditPrivate } from '../../apollo/mutation/payroll';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      showEditDialog: false,
      form: {},
      loading: false,
      freeze: false,
      banks: [],
      rlg: [],
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'n0', 'o0',
          'p0', 'q0', 'r0', 's0', 't0',
          'z0', 'aa0', 'et0', 'ew0',
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
              mutation: EditPrivate,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
                    n0: this.form.n0,
                    o0: this.form.o0,
                    p0: this.form.p0,
                    q0: this.form.q0,
                    r0: this.form.r0,
                    s0: this.form.s0,
                    t0: this.form.t0,
                    z0: this.form.z0,
                    aa0: this.form.aa0,
                    et0: this.form.et0,
                    ew0: this.form.ew0,
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
    payrollPrivate: {
      query: PayrollPrivate,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { freeze, employee } = data.payrollPrivate;
          this.freeze = freeze;
          this.items = employee;
          this.miniSearch.removeAll();
          this.miniSearch.addAll(this.items);
          this.banks = [...new Set(this.items.map((v) => v.s0))].sort();
          this.rlg = [...new Set(this.items.map((v) => v.et0))].sort();
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
