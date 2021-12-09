export default function (data = {}) {
    return {

        // Data
        filters: this.$persist({
            page: 1,
            per_page: 3,
            sort_by: null,
            sort_asc: true,
            search: '',
            filters: {}
        }).as((data.key || 'alpine') + '_filters'),

        route: data.route,
        columns: [],//data.columns,
        items: null,

        results: 0,
        total_results: 0,
        max_pages: 0,
        from: 1,
        to: 1,

        loading: false,
        show_search: false,
        show_filters: false,

        // Bindings
        // None so far...

        // Functions
        init() {

            this.loadItems(true);

            this.$watch('filters.page', () => this.loadItems());
            //this.$watch('filters.per_page, filters.sort_by, filters.sort_asc, filters.search, filters.filters', () => this.resetPage());
            this.$watch('filters.per_page', () => this.resetPage());
            this.$watch('filters.sort_by', () => this.resetPage());
            this.$watch('filters.sort_asc', () => this.resetPage());
            this.$watch('filters.search', () => this.resetPage());
            this.$watch('filters.filters', () => this.resetPage());

            if (this.filters.search.length) {
                this.show_search = true;
            }

        },
        pageUp() {
            this.filters.page = Math.min(this.max_pages, Number(this.filters.page) + 1);
        },
        pageDown() {
            this.filters.page = Math.max(1, Number(this.filters.page) - 1);
        },
        resetPage() {
            if (this.filters.page === 1) {
                this.loadItems();
            } else {
                this.filters.page = 1;
            }
        },
        getColumns() {
            axios.post(this.route, {get: 'columns'})
                .then(response => {
                    this.columns = response.data;
                    this.loadItems();
                })
                .catch(response => {

                })
                .finally(() => {

                });
        },
        loadItems(initial_load) {
            this.loading = true;
            let data = {alpine: this.filters};
            if (initial_load) {
                data.get = 'columns';
            }
            axios.post(this.route, data)
                .then(response => {
                    if (response.data.columns) {
                        this.columns = response.data.columns;
                    }

                    this.results = response.data.count;
                    this.total_results = response.data.total_count;
                    this.from = (this.filters.page - 1) * this.filters.per_page + 1;
                    this.to = Math.min(this.results, (this.filters.page * this.filters.per_page));
                    this.max_pages = Math.ceil(this.results / this.filters.per_page);

                    //this.items = [];
                    //this.$nextTick(() => this.items = response.data.items);
                    this.items = response.data.items;

                })
                .catch(response => {

                })
                .finally(() => {
                    this.loading = false;
                });
        },
        pageString() {
            if (this.items === null) {
                return '';
            } else if (!this.results) {
                return 'No results found';
            }
            let str = '';
            if (this.max_pages === 1) {
                str = 'Showing ' + this.results + ' results';
            } else {
                str = 'Showing ' + this.from + ' to ' + this.to + ' of ' + this.results + ' results';
            }
            if (this.results !== this.total_results) {
                str += ' (' + this.total_results + ' total)';
            }
            return str;
        },
        format(value, format) {

            if (Array.isArray(value)) {
                return value.map(item => this.format(item, format)).join(', ');
            } else if ('object' === typeof value) {
                let output = value.value || value[0] || null;
                if (value.link) {
                    output = '<a href="' + value.link + '" class="hover:underline">' + output + '</a>';
                }
                return output;
            }

            switch (format) {
                case 'currency':
                    value = (new Intl.NumberFormat('en-AU', {
                        style: 'currency',
                        currency: 'AUD'
                    })).format(value);
                    break;
            }

            return value;
        },
        render(item, column) {
            return this.format(item[column.key], column.format);
        },
        setSort(key) {
            if (this.filters.sort_by === key) {
                this.filters.sort_asc = !this.filters.sort_asc;
            } else {
                this.filters.sort_by = key;
                this.filters.sort_asc = true;
            }
        },
        setFilter(column) {
            if ('' === this.filters.filters[column]) {
                delete this.filters.filters[column];
            }
            this.resetPage();
        },
        toggleSearch() {
            this.show_search = !this.show_search;
            if (this.show_search) {
                this.$nextTick(() => {this.$refs.search.focus()});
            } else {
                this.filters.search = '';
            }
        }
    };
};

/* SAFELIST
w-0
 */