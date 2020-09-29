<template>
  <div class="flex flex-col space-y-4">
    <div class="flex items-center space-x-8">
      <div>
        <el-link
          :underline="false"
          type="primary"
          icon="el-icon-download"
          @click="showDialog = true"
        >
          Import
        </el-link>
      </div>
      <div class="flex-1"></div>
      <div class="w-32">
        <el-select v-model="form.year" @change="handleChange">
          <el-option
            v-for="year in years"
            :key="year"
            :label="year"
            :value="year"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <el-table
      v-loading="$apollo.loading"
      :data="eslips"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column
        prop="period"
        label="Period"
      >
        <template slot-scope="scope">
          <nuxt-link
            :to="`list/${scope.row._id}`"
            class="el-link el-link--primary is-underline"
          >
            <i class="el-icon-document"></i>
            <span>
              {{ scope.row.period }}
            </span>
          </nuxt-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="year"
        label="Year"
      >
      </el-table-column>
      <el-table-column min-width="10">
        <template slot-scope="scope">
          <el-dropdown trigger="click" @command="c => handleCommand(c, scope.row._id)">
            <span class="el-dropdown-link flex space-x-1 items-center">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="delete">
                Delete
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="Import"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCancel"
      width="31%"
    >
      <ErrorHandler
        v-if="errors"
        :errors="errors"
        class="mb-8"
      />
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="Period" prop="period">
          <el-date-picker
            v-model="form.period"
            type="daterange"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="dd-MM-yyyy"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="File" prop="file">
          <el-upload
            drag
            action=""
            accept=".xls, .xlsx"
            :file-list="fileList"
            :on-change="handleUploadOnChange"
            :auto-upload="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleImport('form')"
        >
          Import
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getYear } from 'date-fns';
import { ESlips } from '../../apollo/query/eslip';
import ImportESlip from '../../apollo/mutation/import';
import ESlipDelete from '../../apollo/mutation/eslip';

export default {
  data() {
    const year = getYear(new Date());
    const initYear = 2019;

    return {
      showDialog: false,
      loading: false,
      form: {
        period: [],
        file: null,
        year,
      },
      fileList: [],
      rules: {
        period: [
          {
            type: 'array',
            required: true,
            message: 'This field is required',
            len: 2,
            fields: {
              0: { type: 'object', required: 'true' },
              1: { type: 'object', required: 'true' },
            },
          },
        ],
        file: [
          {
            type: 'object',
            required: true,
            message: 'This field is required',
          },
        ],
      },
      years: [...Array(year - (initYear - 1)).keys()].map((i) => i + initYear),
      errors: [],
    };
  },
  methods: {
    handleChange(v) {
      this.form.year = v;
    },
    handleUploadOnChange({ raw }) {
      this.form.file = raw;
    },
    handleCancel() {
      this.fileList = [];
      this.$refs.form.resetFields();
      this.$refs.form.clearValidate();
      this.showDialog = false;
    },
    handleCommand(c, id) {
      if (c === 'delete') this.handleConfirm(id);
    },
    handleConfirm(id) {
      this.$confirm('This will permanently delete the file. Continue?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: ESlipDelete,
          variables: {
            id,
          },
          update: (store, { data: { eslipDelete } }) => {
            const cdata = store.readQuery({
              query: ESlips,
              variables: {
                year: this.form.year,
              },
            });
            const index = cdata.eslips.findIndex((v) => v._id === eslipDelete._id);
            if (index > -1) {
              cdata.eslips.splice(index, 1);
            }
            store.writeQuery({
              query: ESlips,
              variables: {
                year: this.form.year,
              },
              data: cdata,
            });
          },
        });

        this.$message({
          type: 'success',
          message: 'Delete completed',
        });
      }).catch(() => {});
    },
    handleImport(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;
            const client = this.$apolloProvider.clients.upload;

            await client.mutate({
              mutation: ImportESlip,
              variables: {
                input: {
                  file: this.form.file,
                  from: this.form.period[0],
                  to: this.form.period[1],
                },
              },
              update: (store, { data: { importESlip } }) => {
                const cdata = store.readQuery({
                  query: ESlips,
                  variables: {
                    year: this.form.year,
                  },
                });
                cdata.eslips.push(importESlip);
                store.writeQuery({
                  query: ESlips,
                  variables: {
                    year: this.form.year,
                  },
                  data: cdata,
                });
              },
            });

            this.handleCancel();
            this.loading = false;
            return true;
          } catch ({ graphQLErrors, networkError }) {
            this.errors = graphQLErrors.length ? graphQLErrors : networkError.result.errors;
            return false;
          }
        } else {
          return false;
        }
      });
    },
  },
  apollo: {
    $client: 'upload',
    eslips: {
      query: ESlips,
      variables() {
        return {
          year: this.form.year,
        };
      },
      prefetch: false,
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors.length ? graphQLErrors : networkError.result.errors;
      },
    },
  },
};
</script>
