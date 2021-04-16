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
      <el-table-column prop="bj0" label="Total" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.bj0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120"></el-table-column>
    </el-table>

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
            <el-form-item label="Tj. Tidak Tetap Fungsional">
              <el-input v-model="form.ba0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tidak Tetap Shift">
              <el-input v-model="form.bb0r"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Tj. Tidak Tetap Tig Welding">
              <el-input v-model="form.bc0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tidak Tetap Operator Plasma">
              <el-input v-model="form.bd0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tidak Tetap LKS">
              <el-input v-model="form.be0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tidak Tetap Koperasi">
              <el-input v-model="form.bf0r"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Tj. Tidak Tetap Quality System">
              <el-input v-model="form.bg0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tidak Tetap Penghargaan Masa Kerja">
              <el-input v-model="form.bh0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tidak Tetap Others">
              <el-input v-model="form.bi0r"></el-input>
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
import { PayrollNonFixedAllowance } from '../../apollo/query/payroll';
import { EditNonFixedAllowance } from '../../apollo/mutation/payroll';
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
          '_id', 'd0', 'e0', 'ba0', 'bb0', 'bc0', 'bd0',
          'be0', 'bf0', 'bg0', 'bh0', 'bi0', 'bj0',
          'ba0r', 'bb0r', 'bc0r', 'bd0r',
          'be0r', 'bf0r', 'bg0r', 'bh0r', 'bi0r',
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
              mutation: EditNonFixedAllowance,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
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
    payrollNonFixedAllowance: {
      query: PayrollNonFixedAllowance,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee, freeze } = data.payrollNonFixedAllowance;
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
