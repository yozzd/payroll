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
      <el-table-column prop="dk0" label="Dana Pinjaman" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.dk0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dl0" label="Canteen" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.dl0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dm0" label="Kopkar dan BMI" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.dm0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dn0" width="120" align="right">
        <template slot="header">
          <p title="Pph21 Kurang Bayar" class="truncate">
            Pph21 Kurang Bayar
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.dn0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="120"></el-table-column>
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
            <el-form-item label="Dana Pinjaman">
              <el-input v-model="form.dk0"></el-input>
            </el-form-item>
            <el-form-item label="Canteen">
              <el-input v-model="form.dl0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Kopkar dan BMI">
              <el-input v-model="form.dm0"></el-input>
            </el-form-item>
            <el-form-item label="Pph21 Kurang Bayar">
              <el-input v-model="form.dn0"></el-input>
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
import { PayrollDeductionOthers } from '../../apollo/query/payroll';
import { EditDeductionOthers } from '../../apollo/mutation/payroll';
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
          '_id', 'd0', 'e0', 'dk0',
          'dl0', 'dm0', 'dn0',
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
              mutation: EditDeductionOthers,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
                    dk0: parseInt(this.form.dk0, 10),
                    dl0: parseInt(this.form.dl0, 10),
                    dm0: parseInt(this.form.dm0, 10),
                    dn0: parseInt(this.form.dn0, 10),
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
    payrollDeductionOthers: {
      query: PayrollDeductionOthers,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { freeze, employee } = data.payrollDeductionOthers;
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
