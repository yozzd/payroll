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
      max-height="500"
      show-summary
      border
      :summary-method="summaries"
      :row-class-name="finalRow"
    >
      <el-table-column type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100" fixed></el-table-column>
      <el-table-column prop="d0" label="Nama Karyawan" width="200" fixed>
        <template slot-scope="scope">
          <client-only>
            <el-link
              v-if="!freeze"
              type="primary"
              class="font-sm"
              @click="showEdit(scope.row)"
            >
              <p v-snip="1" :title="scope.row.d0">
                {{ scope.row.d0 }}
              </p>
            </el-link>
            <p v-else v-snip="1" :title="scope.row.d0">
              {{ scope.row.d0 }}
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="ba0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Fungsional">
              Tj. Tidak Tetap Fungsional
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ba0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bb0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Shift">
              Tj. Tidak Tetap Shift
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bb0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bc0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Tig Welding">
              Tj. Tidak Tetap Tig Welding
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bc0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bd0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Operator Plasma">
              Tj. Tidak Tetap Operator Plasma
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bd0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="be0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap LKS">
              Tj. Tidak Tetap LKS
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.be0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bf0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Koperasi">
              Tj. Tidak Tetap Koperasi
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bf0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bg0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Quality System">
              Tj. Tidak Tetap Quality System
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bg0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bh0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Penghargaan Masa Kerja">
              Tj. Tidak Tetap Penghargaan Masa Kerja
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bh0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bi0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tidak Tetap Others">
              Tj. Tidak Tetap Others
            </p>
          </client-only>
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
      <el-table-column label="" min-width="120"></el-table-column>
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
              <el-input v-model="form.ba0"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tidak Tetap Shift">
              <el-input v-model="form.bb0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Tj. Tidak Tetap Tig Welding">
              <el-input v-model="form.bc0"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tidak Tetap Operator Plasma">
              <el-input v-model="form.bd0"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tidak Tetap LKS">
              <el-input v-model="form.be0"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tidak Tetap Koperasi">
              <el-input v-model="form.bf0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Tj. Tidak Tetap Quality System">
              <el-input v-model="form.bg0"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tidak Tetap Penghargaan Masa Kerja">
              <el-input v-model="form.bh0"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tidak Tetap Others">
              <el-input v-model="form.bi0"></el-input>
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
          '_id', 'd0', 'e0', 'ba0', 'bb0', 'bc0',
          'bd0', 'be0', 'bf0', 'bg0', 'bh0', 'bi0',
          'bj0',
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
                    ba0: parseInt(this.form.ba0, 10),
                    bb0: parseInt(this.form.bb0, 10),
                    bc0: parseInt(this.form.bc0, 10),
                    bd0: parseInt(this.form.bd0, 10),
                    be0: parseInt(this.form.be0, 10),
                    bf0: parseInt(this.form.bf0, 10),
                    bg0: parseInt(this.form.bg0, 10),
                    bh0: parseInt(this.form.bh0, 10),
                    bi0: parseInt(this.form.bi0, 10),
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
