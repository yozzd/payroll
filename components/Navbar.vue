<template>
  <div class="flex px-12 pt-3 h-16 space-x-8 items-baseline">
    <Brand />
    <nuxt-link to="/dashboard" class="flex-1">
      Dashboard
    </nuxt-link>
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link flex space-x-1 items-center">
        <div>
          Extras
        </div>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="eslip">
          E-Slip
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link flex space-x-1 items-center">
        <div>
          {{ $auth.$state.user.username }}
        </div>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="logout">
          Logout
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  methods: {
    async handleCommand(c) {
      if (c === 'logout') await this.$auth.logout();
      else if (c === 'eslip') this.$router.push({ path: '/eslip/' });
    },
  },
};
</script>
