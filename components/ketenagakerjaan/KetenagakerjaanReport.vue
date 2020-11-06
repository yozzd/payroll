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
      max-height="600"
      show-summary
      :summary-method="summaries"
      :row-class-name="finalRow"
    >
      <el-table-column type="index" width="50" align="center" fixed></el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100" fixed></el-table-column>
      <el-table-column prop="d0" label="Nama Karyawan" width="200" fixed>
        <template slot-scope="scope">
          <client-only>
            <p v-snip="1" :title="scope.row.d0">
              {{ scope.row.d0 }}
            </p>
          </client-only>
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
      <el-table-column prop="ay0" label="Upah" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.ay0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cb0" label="Iuran JKK" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.cb0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cc0" label="Iuran JKM" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.cc0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Iuran JHT Tenaga Kerja" align="center">
        <el-table-column prop="cd0" label="Pemberi Kerja" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cd0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ce0" label="Tenaga Kerja" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ce0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Iuran Jaminan Pensiun" align="center">
        <el-table-column prop="ci0" label="Pemberi Kerja" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cd0 | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cj0" label="Tenaga Kerja" width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.ce0 | currency }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="cm0" label="Total Iuran" width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.cm0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Catatan" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.ck0 }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { KetenagakerjaanReport } from '../../apollo/query/ketenagakerjaan';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'o0', 'aa0', 'ay0',
          'cb0', 'cc0', 'cd0', 'ce0', 'ci0', 'cj0',
          'cm0', 'ck0',
        ],
      }),
    };
  },
  apollo: {
    ketenagakerjaanReport: {
      query: KetenagakerjaanReport,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.ketenagakerjaanReport;
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
