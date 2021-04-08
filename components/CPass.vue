<template>
  <div>
    <div class="flex-1 flex-col space-y-8">
      <div class="text-xl">
        Change Password
      </div>
      <div class="text-red-500">
        You'll be forced to logout after change,<br/>
        Please login with your new password
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
        class="w-2/4"
      >
        <el-form-item label="Old Password" prop="oldPassword">
          <el-input v-model="form.oldPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="New Password" prop="newPassword">
          <el-input v-model="form.newPassword" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('form')"
          >
            Change
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { UserChangePassword } from '../apollo/mutation/user';

export default {
  data() {
    return {
      form: {
        oldPassword: '',
        newPassword: '',
      },
      rules: {
        oldPassword: [
          { required: true, message: 'This field is required' },
        ],
        newPassword: [
          { required: true, message: 'This field is required' },
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
            await this.$apollo.mutate({
              mutation: UserChangePassword,
              variables: {
                id: this.$auth.$state.user._id,
                oldPassword: this.form.oldPassword,
                newPassword: this.form.newPassword,
              },
            });
            this.$auth.logout();
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
