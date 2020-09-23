<template>
  <div class="flex min-h-full">
    <div class="w-2/5 flex flex-col p-12">
      <div class="flex">
        <Brand />
      </div>
      <div class="flex items-center h-full">
        <div class="flex-1 flex-col space-y-8 px-12">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            :hide-required-asterisk="true"
            label-position="top"
          >
            <el-form-item label="Username" prop="username">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
              <el-input v-model="form.password" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')">
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
    };
  },
  methods: {
    submitForm(form) {
      console.log(form);
      this.$refs[form].validate((valid) => {
        if (valid) {
          console.log('submit!');
          return true;
        }
        console.log('error submit!!');
        return false;
      });
    },
  },
};
</script>
