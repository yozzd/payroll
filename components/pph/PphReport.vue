<template>
  <div class="space-y-2">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        Home
      </el-breadcrumb-item>
      <el-breadcrumb-item class="text-xl">
        Pph21
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flex space-x-4 items-center">
      <div class="flex-1">
        <el-badge :value="items.length" type="success">
          {{ content }}
        </el-badge>
      </div>
      <div class="w-64">
        <el-input
          v-model="search"
          placeholder="Search"
          clearable
        />
      </div>
      <el-button
        type="primary"
        :loading="loadingGen"
        :disabled="!multipleSelection.length"
        @click="generate"
      >
        Generate
      </el-button>
    </div>
    <el-progress
      :text-inside="true"
      :stroke-width="16"
      :percentage="percentage"
    ></el-progress>
    <ErrorHandler
      v-if="errors"
      :errors="errors"
    />
    <el-table
      ref="pphTable"
      v-loading="$apollo.loading"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      size="small"
      height="500"
      :row-class-name="finalRow"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="e0" label="No. Karyawan" width="100"></el-table-column>
      <el-table-column prop="d0" label="Nama Karyawan" width="300">
        <template slot-scope="scope">
          <p>
            {{ scope.row.d0 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="File" min-width="300">
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.pph.check"
            :href="`/pph/${scope.row.pph.dir}/${scope.row.pph.name}.pdf`"
            target="_blank"
            type="primary"
            class="font-sm"
          >
            {{ scope.row.pph.name }}.pdf
          </el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { PphReport } from '../../apollo/query/pph';
import { GenPph } from '../../apollo/mutation/pph';
import mix from '../../mixins/payroll';

export default {
  mixins: [mix],
  data() {
    return {
      content: '',
      multipleSelection: [],
      loadingGen: false,
      percentage: 0,
      miniSearch: new MiniSearch({
        idField: '_id',
        fields: ['d0', 'e0'],
        storeFields: [
          '_id', 'd0', 'e0', 'pph',
        ],
      }),
    };
  },
  methods: {
    handleSelectionChange(a) {
      this.multipleSelection = a.map((v) => v._id);
    },
    async generate() {
      try {
        this.loadingGen = true;
        let count = 0;
        const len = this.multipleSelection.length;
        this.percentage = 0;

        await Promise.all(
          this.multipleSelection.map(async (v) => {
            const { data } = await this.$apollo.mutate({
              mutation: GenPph,
              variables: {
                id: this.$route.params.id,
                eId: v,
              },
              update: (store) => {
                const cdata = store.readQuery({
                  query: PphReport,
                  variables: {
                    id: this.$route.params.id,
                  },
                });
                const index = cdata.pphReport.employee.findIndex((e) => e._id === v);
                if (cdata.pphReport.employee[index].pph.check === false) {
                  cdata.pphReport.employee[index].pph.check = true;
                  this.miniSearch.removeAll();
                }
                store.writeQuery({
                  query: PphReport,
                  variables: {
                    id: this.$route.params.id,
                  },
                  data: cdata,
                });
              },
            });
            if (data.genPph.sStatus) {
              count += 1;
              this.percentage = Math.floor((count / len) * 100);
            }
          }),
        );

        this.loadingGen = false;
        this.multipleSelection = [];
        this.$refs.pphTable.clearSelection();
        this.$message({
          type: 'success',
          message: 'Completed',
        });

        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
  },
  apollo: {
    pphReport: {
      query: PphReport,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { period, year, employee } = data.pphReport;
          this.content = `${period} ${year}`;
          this.items = employee;
          this.miniSearch.removeAll();
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