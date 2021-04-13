<template>
  <div class="flex min-h-full">
    <div class="w-2/5 flex flex-col p-12">
      <div class="flex items-center h-full">
        <div class="flex-1 flex-col space-y-8 px-12">
          <div class="flex justify-center">
            <div class="text-4xl font-inter-bold tracking-tighter">
              Payroll
            </div>
          </div>
          <ErrorHandler
            v-if="errors"
            :errors="errors"
          />
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            :hide-required-asterisk="true"
            label-position="top"
            @submit.native.prevent="submitForm('form')"
          >
            <el-form-item label="Username" prop="username">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
              <el-input v-model="form.password" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit">
                Login
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="flex">
        <div class="flex-1">
          &copy; 2020
        </div>
        <div>
          DB
        </div>
      </div>
    </div>
    <div class="w-3/5 bg-gray-100">
      <div class="flex justify-center items-center h-full">
        Placeholder
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: 'This field is required', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'This field is required', trigger: 'blur' },
        ],
      },
      errors: [],
    };
  },
  methods: {
    submitForm(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            await this.$auth.login({
              username: this.form.username,
              password: this.form.password,
            });
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
};
</script>
