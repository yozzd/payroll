<template>
  <div>
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
      :summary-method="summaries"
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
      <el-table-column prop="ab0" width="100" align="right">
        <!--eslint-disable-next-line vue/no-unused-vars-->
        <template slot="header" slot-scope="scope">
          <client-only>
            <p v-snip="1" title="Jam Lembur Normal">
              Jam Lembur Normal
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="ac0" width="100" align="right">
        <!--eslint-disable-next-line vue/no-unused-vars-->
        <template slot="header" slot-scope="scope">
          <client-only>
            <p v-snip="1" title="Amount Lembur Normal">
              Amount Lembur Normal
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="ad0" width="100" align="right">
        <!--eslint-disable-next-line vue/no-unused-vars-->
        <template slot="header" slot-scope="scope">
          <client-only>
            <p v-snip="1" title="Jam Lembur Dinas">
              Jam Lembur Dinas
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="ae0" width="100" align="right">
        <!--eslint-disable-next-line vue/no-unused-vars-->
        <template slot="header" slot-scope="scope">
          <client-only>
            <p v-snip="1" title="Amount Lembur Dinas">
              Amount Lembur Dinas
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="af0" label="Jam Insentif" width="100" align="right"></el-table-column>
      <el-table-column prop="ag0" label="Rate Insentif" width="100" align="right"></el-table-column>
      <el-table-column prop="ah0" width="100" align="right">
        <!--eslint-disable-next-line vue/no-unused-vars-->
        <template slot="header" slot-scope="scope">
          <client-only>
            <p v-snip="1" title="Amount Insentif">
              Amount Insentif
            </p>
          </client-only>
        </template>
      </el-table-column>
      <el-table-column prop="ai0" min-width="100" align="right">
        <!--eslint-disable-next-line vue/no-unused-vars-->
        <template slot="header" slot-scope="scope">
          <client-only>
            <p v-snip="1" title="Total Lembur & Insentif">
              Total Lembur & Insentif
            </p>
          </client-only>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PayrollOvertime } from '../../apollo/query/payroll';

export default {
  data() {
    return {
      items: [],
      search: '',
      errors: [],
      arrSum: [],
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'ab0', 'ac0', 'ad0',
          'ae0', 'af0', 'ag0', 'ah0', 'ai0',
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
    summaries() {
      return this.arrSum;
    },
  },
  apollo: {
    payrollOvertime: {
      query: PayrollOvertime,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const {
            employee,
            total: {
              sab0, sac0,
              sad0, sae0,
              saf0, sag0,
              sah0, sai0,
            },
          } = data.payrollOvertime;

          this.items = employee;
          this.miniSearch.addAll(this.items);
          this.arrSum = [
            'Total', '', '',
            sab0, sac0, sad0,
            sae0, saf0, sag0,
            sah0, sai0,
          ];
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
