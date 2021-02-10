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
      border
      height="500"
      :row-class-name="finalRow"
    >
      <el-table-column type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100" fixed></el-table-column>
      <el-table-column label="Nama Karyawan" width="200" fixed>
        <template slot-scope="scope">
          <client-only>
            <p v-snip="1" :title="scope.row.d0">
              {{ scope.row.d0 }}
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column label="Final Payment" width="100" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.ex0" >
            X
          </p>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tidak Ikut Pensiun">
              Tidak Ikut Pensiun
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <p v-if="scope.row.ey0" >
            X
          </p>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tidak Ikut BPJS">
              Tidak Ikut BPJS
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <p v-if="scope.row.ez0" >
            X
          </p>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tidak Dapat Relaksasi JKK & JK">
              Tidak Dapat Relaksasi JKK & JK
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <p v-if="scope.row.fb0" >
            X
          </p>
        </template>
      </el-table-column>
      <el-table-column min-width="200"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollFlags } from '../../apollo/query/payroll';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'ex0', 'ey0',
          'ez0', 'fb0',
        ],
      }),
    };
  },
  apollo: {
    payrollFlags: {
      query: PayrollFlags,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.payrollFlags;
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
