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
      <el-table-column prop="n0" label="Jenis Kelamin" width="100"></el-table-column>
      <el-table-column prop="o0" label="Birthday" width="100"></el-table-column>
      <el-table-column label="NPWP" align="center">
        <el-table-column prop="p0" label="Status" width="80"></el-table-column>
        <el-table-column prop="q0" label="No." width="160"></el-table-column>
        <el-table-column prop="r0" label="Status Tanggungan" width="140"></el-table-column>
      </el-table-column>
      <el-table-column label="Bank" align="center">
        <el-table-column prop="s0" label="Name" width="100"></el-table-column>
        <el-table-column prop="t0" label="No." width="160"></el-table-column>
      </el-table-column>
      <el-table-column label="BPJS" align="center">
        <el-table-column prop="z0" label="Ketenagakerjaan" width="160"></el-table-column>
        <el-table-column prop="aa0" label="Kesehatan" width="160"></el-table-column>
      </el-table-column>
      <el-table-column prop="ew0" label="Email" min-width="300"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollPrivate } from '../../apollo/query/payroll';

export default {
  data() {
    return {
      items: [],
      search: '',
      errors: [],
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'n0', 'o0',
          'p0', 'q0', 'r0', 's0', 't0',
          'z0', 'aa0', 'ew0',
        ],
      }),
    };
  },
  computed: {
    tableData() {
      if (this.search) {
        return this.miniSearch.search(this.search, { prefix: true });
      }
      return this.items;
    },
  },
  methods: {
    finalRow({ row }) {
      if (row.ex0 === 1) {
        return 'final-row';
      }
      return '';
    }
  },
  apollo: {
    payrollPrivate: {
      query: PayrollPrivate,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.payrollPrivate;
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
