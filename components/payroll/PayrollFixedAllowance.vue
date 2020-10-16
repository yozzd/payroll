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
      show-summary
      border
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
      <el-table-column prop="aj0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Living">
              Tj. Tetap Living
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.aj0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ak0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Perumahan">
              Tj. Tetap Perumahan
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ak0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="al0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Posisi Fix">
              Tj. Tetap Posisi
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.al0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="am0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Fungsional Fix">
              Tj. Tetap Fungsional
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.am0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="an0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Koordinator">
              Tj. Tetap Koordinator
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.an0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ao0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Transport">
              Tj. Tetap Transport
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ao0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ap0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Komunikasi">
              Tj. Tetap Komunikasi
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ap0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aq0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Expertisi">
              Tj. Tetap Expertisi
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.aq0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ar0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Honorarium">
              Tj. Tetap Honorarium
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.ar0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="as0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Posisi Variable">
              Tj. Tetap Posisi Variable
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.as0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="at0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Fungsional Variable">
              Tj. Tetap Fungsional Variable
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.at0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="au0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Acting / PLT">
              Tj. Tetap Acting / PLT
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.au0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="av0" width="120" align="right">
        <template slot="header">
          <client-only>
            <p v-snip="1" title="Tj. Tetap Others">
              Tj. Tetap Others
            </p>
          </client-only>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.av0 | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aw0" label="Total" min-width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.aw0 | currency }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollFixedAllowance } from '../../apollo/query/payroll';

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
          '_id', 'd0', 'e0', 'aj0', 'ak0', 'al0',
          'am0', 'an0', 'ao0', 'ap0', 'aq0', 'ar0',
          'as0', 'at0', 'au0', 'av0', 'aw0',
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
    summaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = this.$options.filters.currency(values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0));
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
    finalRow({ row }) {
      if (row.ex0 === 1) {
        return 'final-row';
      }
      return '';
    }
  },
  apollo: {
    payrollFixedAllowance: {
      query: PayrollFixedAllowance,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { employee } = data.payrollFixedAllowance;
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
