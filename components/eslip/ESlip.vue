<template>
  <div class="flex flex-col space-y-4">
    <div class="flex items-center space-x-8">
      <div>
        <el-link
          :underline="false"
          icon="el-icon-download"
          @click="showDialog = true"
        >
          Import
        </el-link>
      </div>
      <div class="flex-1"></div>
      <div>
        Placeholder
      </div>
    </div>

    <el-dialog title="Import" :visible.sync="showDialog" width="40%">
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleImport('form')">Import</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDialog: false,
      form: {
        period: [],
      },
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
      },
    };
  },
  methods: {
    handleImport(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            console.log(this.form.period);
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
};
</script>
