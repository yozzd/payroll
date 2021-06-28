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
      <el-table-column prop="bv0" width="120" align="right">
        <template slot="header">
          <p title="Tambahan Lain Tidak Kena Pajak" class="truncate">
            Tambahan Lain Tidak Kena Pajak
          </p>
        </template>
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.bv0a"
            placement="top-start"
            width="200"
            trigger="hover"
            :content="scope.row.bv0a"
          >
            <i slot="reference" class="el-icon-chat-dot-square"></i>
          </el-popover>
          <span>{{ scope.row.bv0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="THR Prorate" align="center">
        <el-table-column label="Months" width="80" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.bw0 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bx0" label="Amount" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.bx0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="dr0" label="Other Income" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.dr0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Uang Pisah" align="center">
        <el-table-column width="80" align="center">
          <template slot="header">
            <p title="Lama Kerja" class="truncate">
              Lama Kerja
            </p>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.ds0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dt0" label="Amount" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.dt0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Uang Pesangon" align="center">
        <el-table-column width="80" align="center">
          <template slot="header">
            <p title="Lama Kerja" class="truncate">
              Lama Kerja
            </p>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.du0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dv0" label="Amount" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.dv0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Uang Penghargaan Masa Kerja" align="center">
        <el-table-column width="80" align="center">
          <template slot="header">
            <p title="Lama Kerja" class="truncate">
              Lama Kerja
            </p>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.dw0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dx0" label="Amount" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.dx0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="dy0" width="120" align="right">
        <template slot="header">
          <p title="Uang Penggantian Hak" class="truncate">
            Uang Penggantian Hak
          </p>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.dy0 | currency }}</span>
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
            <el-form-item label="Tambahan Lain Tidak Kena Pajak">
              <el-input v-model="form.bv0"></el-input>
            </el-form-item>
            <el-form-item label="Keterangan">
              <el-input v-model="form.bv0a" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="Months (THR Prorate)">
              <el-input v-model="form.bw0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Other Income">
              <el-input v-model="form.dr0"></el-input>
            </el-form-item>
            <el-form-item label="Lama Kerja (Uang Pisah)">
              <el-input v-model="form.ds0"></el-input>
            </el-form-item>
            <el-form-item label="Lama Kerja (Uang Pesangon)">
              <el-input v-model="form.du0"></el-input>
            </el-form-item>
            <el-form-item label="Lama Kerja (Uang Penghargaan Masa Kerja)">
              <el-input v-model="form.dw0"></el-input>
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
import { PayrollEarningOthers } from '../../apollo/query/payroll';
import { EditEarningOthers } from '../../apollo/mutation/payroll';
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
          '_id', 'd0', 'e0', 'bv0', 'bv0a',
          'bw0', 'bx0', 'dr0', 'ds0', 'dt0',
          'du0', 'dv0', 'dw0', 'dx0', 'dy0',
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
              mutation: EditEarningOthers,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
                    bv0: parseInt(this.form.bv0, 10),
                    bv0a: this.form.bv0a,
                    bw0: parseInt(this.form.bw0, 10),
                    dr0: parseInt(this.form.dr0, 10),
                    ds0: parseInt(this.form.ds0, 10),
                    du0: parseInt(this.form.du0, 10),
                    dw0: parseInt(this.form.dw0, 10),
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
    payrollEarningOthers: {
      query: PayrollEarningOthers,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { freeze, employee } = data.payrollEarningOthers;
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
