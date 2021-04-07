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
      <el-table-column label="Iuran JKK / JK" align="center">
        <el-table-column prop="cb0" label="JKK" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cb0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cc0" label="JK" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cc0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Iuran JHT" align="center">
        <el-table-column prop="cd0" label="Perusahaan" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cd0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ce0" label="Karyawan" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ce0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Iuran Pensiun" align="center">
        <el-table-column prop="ci0" label="Perusahaan" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ci0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cj0" label="Karyawan" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cj0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="ck0" label="Desc. (BPJS Ketenagakerjaan)" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.ck0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Iuran BPJS Kesehatan" align="center">
        <el-table-column prop="cq0" label="Perusahaan" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cq0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cr0" label="Karyawan" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cr0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="ct0" label="Desc. (BPJS Kesehatan)" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.ct0 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="co0"
        label="Upah Untuk Pelaporan BPJS Kesehatan"
        width="120"
        align="right"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.co0 | currency }}</span>
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
            <el-form-item label="Desc. (BPJS Ketenagakerjaan)">
              <el-input v-model="form.ck0" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="Desc. (BPJS Kesehatan)">
              <el-input v-model="form.ct0" type="textarea"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Upah untuk Pelaporan BPJS Kesehatan">
              <el-input v-model="form.co0"></el-input>
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
import { PayrollFee } from '../../apollo/query/payroll';
import { EditFee } from '../../apollo/mutation/payroll';
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
          '_id', 'd0', 'e0', 'cb0', 'cc0', 'cd0', 'ce0',
          'ci0', 'cj0', 'ck0', 'cq0', 'cr0', 'ct0', 'co0',
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
              mutation: EditFee,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
                    ck0: this.form.ck0,
                    ct0: this.form.ct0,
                    co0: parseInt(this.form.co0, 10),
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
    payrollFee: {
      query: PayrollFee,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee, freeze } = data.payrollFee;
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
