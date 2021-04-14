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
              <el-input v-model="form.aj0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Perumahan">
              <el-input v-model="form.ak0r"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Tj. Tetap Posisi Fix">
              <el-input v-model="form.al0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Funsional Fix">
              <el-input v-model="form.am0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Koordinator">
              <el-input v-model="form.an0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Transport">
              <el-input v-model="form.ao0r"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Tj. Tetap Komunikasi">
              <el-input v-model="form.ap0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Expertisi">
              <el-input v-model="form.aq0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Honorarium">
              <el-input v-model="form.ar0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Posisi Variable">
              <el-input v-model="form.as0r"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Tj. Funsional Variable">
              <el-input v-model="form.at0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Tetap Acting / PLT">
              <el-input v-model="form.au0r"></el-input>
            </el-form-item>
            <el-form-item label="Tj. Others">
              <el-input v-model="form.av0r"></el-input>
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
      freeze: false,
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'aj0', 'ak0', 'al0',
          'am0', 'an0', 'ao0', 'ap0', 'aq0', 'ar0',
          'as0', 'at0', 'au0', 'av0', 'aw0',
          'aj0r', 'ak0r', 'al0r', 'am0r', 'an0r',
          'ao0r', 'ap0r', 'aq0r', 'ar0r',
          'as0r', 'at0r', 'au0r', 'av0r',
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
                    aj0r: parseInt(this.form.aj0r, 10),
                    ak0r: parseInt(this.form.ak0r, 10),
                    al0r: parseInt(this.form.al0r, 10),
                    am0r: parseInt(this.form.am0r, 10),
                    an0r: parseInt(this.form.an0r, 10),
                    ao0r: parseInt(this.form.ao0r, 10),
                    ap0r: parseInt(this.form.ap0r, 10),
                    aq0r: parseInt(this.form.aq0r, 10),
                    ar0r: parseInt(this.form.ar0r, 10),
                    as0r: parseInt(this.form.as0r, 10),
                    at0r: parseInt(this.form.at0r, 10),
                    au0r: parseInt(this.form.au0r, 10),
                    av0r: parseInt(this.form.av0r, 10),
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
          const { freeze, employee } = data.payrollFixedAllowance;
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
