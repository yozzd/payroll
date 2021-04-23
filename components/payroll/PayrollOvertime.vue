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
      <el-table-column label="Lembur Normal" align="center">
        <el-table-column prop="ab0" label="Hour" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ab0 | frac2 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ac0" label="Amount" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ac0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Lembur Dinas" align="center">
        <el-table-column prop="ad0" label="Hour" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ad0 | frac2 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ae0" label="Amount" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ae0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Insentif" align="center">
        <el-table-column prop="af0" label="Hour" width="100" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.af0 | frac2 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ag0" label="Rate" width="100" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ag0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ah0" label="Amount" width="100" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ah0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="ai0" label="Total" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ai0 | currency }}</span>
        </template>
      </el-table-column>
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
            <el-form-item label="Hour (Lembur Normal)">
              <el-input v-model="form.ab0"></el-input>
            </el-form-item>
            <el-form-item label="Hour (Lembur Dinas)">
              <el-input v-model="form.ad0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Hour (Insentif)">
              <el-input v-model="form.af0"></el-input>
            </el-form-item>
            <el-form-item label="Rate (Insentif)">
              <el-input v-model="form.ag0"></el-input>
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
import { PayrollOvertime } from '../../apollo/query/payroll';
import { EditOvertime } from '../../apollo/mutation/payroll';
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
          '_id', 'd0', 'e0', 'ab0', 'ac0', 'ad0',
          'ae0', 'af0', 'ag0', 'ah0', 'ai0',
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
              mutation: EditOvertime,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
                    ab0: parseFloat(this.form.ab0),
                    ad0: parseFloat(this.form.ad0),
                    af0: parseFloat(this.form.af0),
                    ag0: parseInt(this.form.ag0, 10),
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
    payrollOvertime: {
      query: PayrollOvertime,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { freeze, employee } = data.payrollOvertime;
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
