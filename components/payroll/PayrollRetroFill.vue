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
      <el-table-column prop="bl0" width="120" align="right">
        <template slot="header">
          <p title="Pembetulan Pembayaran Koreksi Absen" class="truncate">
            Pembetulan Pembayaran Koreksi Absen
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bl0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bm0" width="120" align="right">
        <template slot="header">
          <p title="Pembetulan Pembayaran Koreksi Gaji & Hari Kerja" class="truncate">
            Pembetulan Pembayaran Koreksi Gaji & Hari Kerja
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bm0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bn0" width="120" align="right">
        <template slot="header">
          <p title="Pembetulan Pembayaran OT" class="truncate">
            Pembetulan Pembayaran OT
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bn0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bo0" width="120" align="right">
        <template slot="header">
          <p title="Pembetulan Pembayaran Tunjangan" class="truncate">
            Pembetulan Pembayaran Tunjangan
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bo0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bp0" width="120" align="right">
        <template slot="header">
          <p title="Pembetulan Pembayaran Insentif" class="truncate">
            Pembetulan Pembayaran Insentif
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bp0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bq0" width="120" align="right">
        <template slot="header">
          <p title="Pembetulan Pembayaran THR" class="truncate">
            Pembetulan Pembayaran THR
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bq0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="br0" width="120" align="right">
        <template slot="header">
          <p title="Pembetulan Pembayaran Allowance" class="truncate">
            Pembetulan Pembayaran Allowance
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.br0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bs0" width="120" align="right">
        <template slot="header">
          <p title="Pembetulan Pembayaran Uang Makan Security" class="truncate">
            Pembetulan Pembayaran Uang Makan Security
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bs0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bt0" width="120" align="right">
        <template slot="header">
          <p title="Pembetulan Pembayaran Others" class="truncate">
            Pembetulan Pembayaran Others
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.bt0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bu0" label="Total" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.bu0 | currency }}</span>
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
            <el-form-item label="Pembetulan Pembayaran Koreksi Absen">
              <el-input v-model="form.bl0"></el-input>
            </el-form-item>
            <el-form-item label="Pembetulan Pembayaran Koreksi Gaji & Hari Kerja">
              <el-input v-model="form.bm0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Pembetulan Pembayaran OT">
              <el-input v-model="form.bn0"></el-input>
            </el-form-item>
            <el-form-item label="Pembetulan Pembayaran Tunjangan">
              <el-input v-model="form.bo0"></el-input>
            </el-form-item>
            <el-form-item label="Pembetulan Pembayaran Insentif">
              <el-input v-model="form.bp0"></el-input>
            </el-form-item>
            <el-form-item label="Pembetulan Pembayaran THR">
              <el-input v-model="form.bq0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Pembetulan Pembayaran Allowance">
              <el-input v-model="form.br0"></el-input>
            </el-form-item>
            <el-form-item label="Pembetulan Pembayaran Uang Makan Security">
              <el-input v-model="form.bs0"></el-input>
            </el-form-item>
            <el-form-item label="Pembetulan Pembayaran Others">
              <el-input v-model="form.bt0"></el-input>
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
import { PayrollRetroFill } from '../../apollo/query/payroll';
import { EditRetroFill } from '../../apollo/mutation/payroll';
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
          '_id', 'd0', 'e0', 'bl0', 'bm0', 'bn0',
          'bo0', 'bp0', 'bq0', 'br0', 'bs0', 'bt0',
          'bu0',
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
              mutation: EditRetroFill,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
                    bl0: parseInt(this.form.bl0, 10),
                    bm0: parseInt(this.form.bm0, 10),
                    bn0: parseInt(this.form.bn0, 10),
                    bo0: parseInt(this.form.bo0, 10),
                    bp0: parseInt(this.form.bp0, 10),
                    bq0: parseInt(this.form.bq0, 10),
                    br0: parseInt(this.form.br0, 10),
                    bs0: parseInt(this.form.bs0, 10),
                    bt0: parseInt(this.form.bt0, 10),
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
    payrollRetroFill: {
      query: PayrollRetroFill,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { freeze, employee } = data.payrollRetroFill;
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
