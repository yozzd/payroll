<template>
  <div class="space-y-4">
    <el-page-header :content="content" @back="goBack">
    </el-page-header>
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
      max-height="600"
      show-summary
      :summary-method="summaries"
      :row-class-name="finalRow"
    >
      <el-table-column type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100" fixed></el-table-column>
      <el-table-column prop="d0" label="Nama Karyawan" width="300" fixed>
        <template slot-scope="scope">
          <p>
            {{ scope.row.d0 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="No. KPJ" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.z0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="No. BPJS Kesehatan" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.aa0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Tanggal Lahir" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.o0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="co0" label="Upah" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.co0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Iuran BPJS Kesehatan" align="center">
        <el-table-column prop="cq0" label="Pemberi Kerja" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cq0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cr0" label="Tenaga Kerja" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cr0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Kelas Rawat" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cs0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cu0" label="Total Iuran" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.cu0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Catatan" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.ct0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="120"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { KesehatanReport } from '../../apollo/query/kesehatan';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      content: '',
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'o0', 'aa0', 'co0',
          'cq0', 'cr0', 'cs0', 'ct0', 'cu0',
        ],
      }),
    };
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/dashboard/' });
    },
  },
  apollo: {
    kesehatanReport: {
      query: KesehatanReport,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { period, year, employee } = data.kesehatanReport;
          this.items = employee;
          this.miniSearch.addAll(this.items);
          this.content = `${period} ${year}`;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
