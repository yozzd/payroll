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
      max-height="500"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        align="center"
      ></el-table-column>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column label="Username" width="200">
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="showEditDialog(scope.row)"
          >
            {{ scope.row.username }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="Role" width="100">
        <template slot-scope="scope">
          {{ roles[scope.row.role] }}
        </template>
      </el-table-column>
      <el-table-column min-width="120"></el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="page"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="users.length"
      :pager-count="pagerCount"
      layout="total, sizes, prev, pager, next"
      class="flex justify-end"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

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
        :rules="rules"
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
            <el-option label="Guest" value="guest"></el-option>
            <el-option label="Guest 2" value="guest2"></el-option>
            <el-option label="Guest 3" value="guest3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleAdd('formAdd')"
          >
            Save
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="Edit User"
      :visible.sync="showEdit"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleEditClose"
      width="20%"
    >
      <el-form
        ref="formEdit"
        :model="formEdit"
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="Username" prop="username">
          <el-input v-model="formEdit.username"></el-input>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="formEdit.role" filterable>
            <el-option label="Admin" value="admin"></el-option>
            <el-option label="User" value="user"></el-option>
            <el-option label="Guest" value="guest"></el-option>
            <el-option label="Guest 2" value="guest2"></el-option>
            <el-option label="Guest 3" value="guest3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleEdit('formEdit')"
          >
            Update
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import pullAllBy from 'lodash/pullAllBy';
import { Users } from '../apollo/query/user';
import { UserCreate, UserEdit, UserDelete } from '../apollo/mutation/user';
import mix from '../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      users: [],
      roles: {
        admin: 'Admin',
        user: 'User',
        guest: 'Guest',
        guest2: 'Guest 2',
        guest3: 'Guest 3',
      },
      showAdd: false,
      showEdit: false,
      multipleSelection: [],
      cachedMultipleSelection: [],
      formAdd: {
        username: '',
        password: '',
        role: '',
      },
      rules: {
        username: [{ required: true, message: 'Required' }],
        password: [{ required: true, message: 'Required' }],
        role: [{ required: true, message: 'Required', trigger: 'change' }],
      },
      formEdit: {},
      errors: [],
    };
  },
  methods: {
    handleAddClose() {
      this.$refs.formAdd.resetFields();
      this.showAdd = false;
    },
    handleAdd(form) {
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
    showEditDialog(row) {
      this.showEdit = true;
      this.formEdit = { ...row };
    },
    handleEditClose() {
      this.$refs.formEdit.resetFields();
      this.showEdit = false;
    },
    handleEdit(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            await this.$apollo.mutate({
              mutation: UserEdit,
              variables: {
                id: this.formEdit._id,
                username: this.formEdit.username,
                role: this.formEdit.role,
              },
            });

            this.handleEditClose();
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
