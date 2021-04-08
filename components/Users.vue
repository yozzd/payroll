<template>
  <div class="flex-1 flex-col space-y-8">
    <div class="text-xl">
      User Management
    </div>
    <ErrorHandler
      v-if="errors"
      :errors="errors"
    />
    <div class="flex flex-row-reverse space-x-4 space-x-reverse">
      <div>
        <el-link
          :underline="false"
          type="primary"
          @click="showAdd = true"
        >
          Add User
        </el-link>
      </div>
      <div>
        <el-link
          :underline="false"
          type="primary"
          :disabled="!multipleSelection.length"
          @click="handleDelete"
        >
          Delete
        </el-link>
      </div>
    </div>
    <el-table
      v-loading="$apollo.loading"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      :data="users"
      size="small"
      max-height="500"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        align="center"
      ></el-table-column>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="username" label="Username" width="200"></el-table-column>
      <el-table-column prop="role" label="Role" width="100"></el-table-column>
      <el-table-column label="" min-width="120"></el-table-column>
    </el-table>

    <el-dialog
      title="Add User"
      :visible.sync="showAdd"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleAddClose"
      width="20%"
    >
      <el-form
        ref="formAdd"
        :model="formAdd"
        :rules="rulesAdd"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="Username" prop="username">
          <el-input v-model="formAdd.username"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="formAdd.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="formAdd.role" filterable>
            <el-option label="Admin" value="admin"></el-option>
            <el-option label="User" value="user"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitAdd('formAdd')"
          >
            Save
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import pullAllBy from 'lodash/pullAllBy';
import { Users } from '../apollo/query/user';
import { UserCreate, UserDelete } from '../apollo/mutation/user';

export default {
  data() {
    return {
      showAdd: false,
      multipleSelection: [],
      cachedMultipleSelection: [],
      formAdd: {
        username: '',
        password: '',
        role: '',
      },
      rulesAdd: {
        username: [{ required: true, message: 'Required' }],
        password: [{ required: true, message: 'Required' }],
        role: [{ required: true, message: 'Required', trigger: 'change' }],
      },
      errors: [],
    };
  },
  methods: {
    handleAddClose() {
      this.$refs.formAdd.resetFields();
      this.showAdd = false;
    },
    submitAdd(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            await this.$apollo.mutate({
              mutation: UserCreate,
              variables: {
                username: this.formAdd.username,
                password: this.formAdd.password,
                role: this.formAdd.role,
              },
              update: (store, { data: { userCreate } }) => {
                const cdata = store.readQuery({
                  query: Users,
                });
                cdata.users.push(userCreate);
                store.writeQuery({
                  query: Users,
                  data: cdata,
                });
              },
            });

            this.handleAddClose();
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
    handleSelectionChange(arr) {
      this.multipleSelection = arr.map((v) => ({ _id: v._id }));
      this.cachedMultipleSelection = arr;
    },
    handleDelete() {
      this.$confirm('This will permanently delete the data. Continue?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: UserDelete,
          variables: {
            del: this.multipleSelection,
          },
          update: (store, { data: { userDelete } }) => {
            const cdata = store.readQuery({
              query: Users,
            });
            pullAllBy(cdata.users, userDelete, '_id');
            store.writeQuery({
              query: Users,
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            userDelete: this.cachedMultipleSelection,
          },
        });
      }).catch(() => {});
    },
  },
  apollo: {
    users: {
      query: Users,
      prefetch: false,
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
