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
      <el-table-column prop="d0" label="Nama Karyawan" width="300" fixed>
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
      <el-table-column prop="cz0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pajak Penghasilan Ber-NPWP">
              Pajak Penghasilan Ber-NPWP
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.cz0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="da0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pajak Penghasilan Non-NPWP">
              Pajak Penghasilan Non-NPWP
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.da0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="db0" label="Total" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.db0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="es0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pengembalian Pajak DTP">
              Pengembalian Pajak DTP
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.es0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Periode Pajak" align="center">
        <el-table-column label="Bulan" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.dz0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Total Bulan" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ea0 }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="" min-width="120"></el-table-column>
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
        <el-form-item label="Periode Pajak (Bulan)">
          <el-input v-model="form.dz0"></el-input>
        </el-form-item>
        <el-form-item label="Periode Pajak (Total)">
          <el-input v-model="form.ea0"></el-input>
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
import { PayrollTax } from '../../apollo/query/payroll';
import { EditTax } from '../../apollo/mutation/payroll';
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
          '_id', 'd0', 'e0', 'cz0', 'da0', 'db0',
          'dz0', 'ea0', 'es0',
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
              mutation: EditTax,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
                    dz0: this.form.dz0,
                    ea0: parseInt(this.form.ea0, 10),
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
    payrollTax: {
      query: PayrollTax,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { freeze, employee } = data.payrollTax;
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
