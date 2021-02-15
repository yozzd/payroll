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
      <el-table-column prop="aj0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Living">
              Tj. Tetap Living
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.aj0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ak0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Perumahan">
              Tj. Tetap Perumahan
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ak0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="al0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Posisi Fix">
              Tj. Tetap Posisi
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.al0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="am0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Fungsional Fix">
              Tj. Tetap Fungsional
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.am0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="an0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Koordinator">
              Tj. Tetap Koordinator
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.an0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ao0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Transport">
              Tj. Tetap Transport
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ao0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ap0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Komunikasi">
              Tj. Tetap Komunikasi
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ap0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aq0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Expertisi">
              Tj. Tetap Expertisi
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.aq0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ar0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Honorarium">
              Tj. Tetap Honorarium
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ar0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="as0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Posisi Variable">
              Tj. Tetap Posisi Variable
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.as0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="at0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Fungsional Variable">
              Tj. Tetap Fungsional Variable
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.at0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="au0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Acting / PLT">
              Tj. Tetap Acting / PLT
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.au0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="av0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Others">
              Tj. Tetap Others
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.av0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aw0" label="Total" min-width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.aw0 | currency }}</span>
        </template>
      </el-table-column>
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
            <el-form-item label="Tj. Tetap Living">
              <el-input v-model="form.aj0"></el-input>
            </el-form-item>
            <el-form-item label="Tj.Tetap Perumahan">
              <el-input v-model="form.ak0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Tj. Tetap Posisi Fix">
              <el-input v-model="form.al0"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Funsional Fix">
              <el-input v-model="form.am0"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Koordinator">
              <el-input v-model="form.an0"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Transport">
              <el-input v-model="form.ao0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Tj. Tetap Komunikasi">
              <el-input v-model="form.ap0"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Expertisi">
              <el-input v-model="form.aq0"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Honorarium">
              <el-input v-model="form.ar0"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Posisi Variable">
              <el-input v-model="form.as0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Tj. Funsional Variable">
              <el-input v-model="form.at0"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Acting / PLT">
              <el-input v-model="form.au0"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Others">
              <el-input v-model="form.av0"></el-input>
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
import { PayrollFixedAllowance } from '../../apollo/query/payroll';
import { EditFixedAllowance } from '../../apollo/mutation/payroll';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      showEditDialog: false,
      form: {},
      loading: false,
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'aj0', 'ak0', 'al0',
          'am0', 'an0', 'ao0', 'ap0', 'aq0', 'ar0',
          'as0', 'at0', 'au0', 'av0', 'aw0',
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
              mutation: EditFixedAllowance,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
                    aj0: parseInt(this.form.aj0, 10),
                    ak0: parseInt(this.form.ak0, 10),
                    al0: parseInt(this.form.al0, 10),
                    am0: parseInt(this.form.am0, 10),
                    an0: parseInt(this.form.an0, 10),
                    ao0: parseInt(this.form.ao0, 10),
                    ap0: parseInt(this.form.ap0, 10),
                    aq0: parseInt(this.form.aq0, 10),
                    ar0: parseInt(this.form.ar0, 10),
                    as0: parseInt(this.form.as0, 10),
                    at0: parseInt(this.form.at0, 10),
                    au0: parseInt(this.form.au0, 10),
                    av0: parseInt(this.form.av0, 10),
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
    payrollFixedAllowance: {
      query: PayrollFixedAllowance,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.payrollFixedAllowance;
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
