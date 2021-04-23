export default {
  data() {
    return {
      items: [],
      search: '',
      errors: [],
      miniSearch: null,
      page: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100],
    };
  },
  computed: {
    tableData() {
      if (this.search) {
        return this.miniSearch.search(this.search, { prefix: true });
      }
      return this.items.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page);
    },
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.page = val;
    },
    summaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => Number.isNaN(Number(value)))) {
          sums[index] = this.$options.filters.currency(values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!Number.isNaN(Number(value))) {
              return prev + curr;
            }
            return prev;
          }, 0));
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
    finalRow({ row }) {
      if (row.ex0) {
        return 'final-row';
      }
      if (row.af0 && !row.ag0) {
        return 'warning-row';
      }
      return '';
    },
  },
};
