export default {
  data() {
    return {
      items: [],
      search: '',
      errors: [],
      miniSearch: null,
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
};