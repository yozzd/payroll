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
      <el-table-column label="Nama Karyawan" width="300" fixed>
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
      <el-table-column prop="dc0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pemotongan Kelebihan Bayar Gaji & Koreksi Absen">
              Pemotongan Kelebihan Bayar Gaji & Koreksi Absen
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.dc0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dd0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pemotongan Kelebihan Bayar OT">
              Pemotongan Kelebihan Bayar OT
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.dd0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="de0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pemotongan Prorate Absen">
              Pemotongan Prorate Absen
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.de0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dg0" label="Pemotongan" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.dg0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dh0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pemotongan Toolroom">
              Pemotongan Toolroom
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.dh0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="di0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Pemotongan Lain">
              Pemotongan Lain
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.di0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dj0" label="Total" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.dj0 | currency }}</span>
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
            <el-form-item label="Pemotongan Kelebihan Bayar Gaji & Koreksi Absen">
              <el-input v-model="form.dc0"></el-input>
            </el-form-item>
            <el-form-item label="Pemotongan Kelebihan Bayar OT">
              <el-input v-model="form.dd0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item label="Pemotongan Prorate Absen">
              <el-input v-model="form.de0"></el-input>
            </el-form-item>
            <el-form-item label="Pemotongan">
              <el-input v-model="form.dg0"></el-input>
            </el-form-item>
            <el-form-item label="Pemotongan Toolroom">
              <el-input v-model="form.dh0"></el-input>
            </el-form-item>
            <el-form-item label="Pemotongan Lain">
              <el-input v-model="form.di0"></el-input>
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
import { PayrollReduction } from '../../apollo/query/payroll';
import { EditReduction } from '../../apollo/mutation/payroll';
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
          '_id', 'd0', 'e0', 'dc0', 'dd0', 'de0',
          'dg0', 'dh0', 'di0', 'dj0',
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
              mutation: EditReduction,
              variables: {
                input: {
                  _id: this.$route.params.id,
                  employee: {
                    _id: this.form._id,
                    dc0: parseInt(this.form.dc0, 10),
                    dd0: parseInt(this.form.dd0, 10),
                    de0: parseInt(this.form.de0, 10),
                    dg0: parseInt(this.form.dg0, 10),
                    dh0: parseInt(this.form.dh0, 10),
                    di0: parseInt(this.form.di0, 10),
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
    payrollReduction: {
      query: PayrollReduction,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { freeze, employee } = data.payrollReduction;
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
