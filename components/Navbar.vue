<template>
  <div class="flex px-12 pt-3 h-16 space-x-8 items-baseline">
    <Brand />
    <nuxt-link to="/dashboard/">
      Dashboard
    </nuxt-link>
    <div class="flex-1"></div>
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        Extras<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="eslip">
          E-Slip
        </el-dropdown-item>
        <el-dropdown-item command="prorate">
          Prorate
        </el-dropdown-item>
        <el-dropdown-item command="tax">
          Tax
        </el-dropdown-item>
        <el-dropdown-item command="thr">
          THR
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
      else if (c === 'prorate') this.$router.push({ path: '/prorate/' });
      else if (c === 'tax') this.$router.push({ path: '/tax/' });
      else if (c === 'thr') this.$router.push({ path: '/thr/' });
    },
  },
};
</script>
