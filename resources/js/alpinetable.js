import axios from 'axios';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default function ( data = {} ) {
	return {
		
		// Data
		default_filters: {
			page: 1,
			per_page: '25',
			sort_by: null,
			sort_asc: null,
			search: '',
			filters: {}
		},
		filters: this.$persist( {
			page: 1,
			per_page: '25',
			sort_by: null,
			sort_asc: null,
			search: '',
			filters: {}
		} ).as( (data.key || 'alpinetable') + '_filters' ),
		
		app_url: data.app_url || '',
		route: data.route,
		rule: data.rule || null,
		columns: [],
		items: [],
		
		results: 0,
		total_results: 0,
		max_pages: 0,
		from: 1,
		to: 1,
		
		loading: false,
		show_search: false,
		show_filters: false,
		filtered: false,
		
		cancelToken: null,
		haltRequests: false,
		
		// Bindings
		// None so far...
		
		// Functions
		init() {
			
			this.loadItems( true );
			
			this.$watch( 'filters.page', () => this.loadItems() );
			
			this.$watch( 'filters.per_page', () => this.resetPage() );
			this.$watch( 'filters.sort_by', () => this.resetPage() );
			this.$watch( 'filters.sort_asc', () => this.resetPage() );
			this.$watch( 'filters.search', () => this.resetPage() );
			this.$watch( 'filters.filters', () => this.resetPage() );
			
			this.$nextTick( () => this.replaceIcons() );
			
			if ( this.filters.search.length ) {
				this.show_search = true;
			}
			
		},
		pageUp() {
			this.filters.page = Math.min( this.max_pages, Number( this.filters.page ) + 1 );
		},
		pageDown() {
			this.filters.page = Math.max( 1, Number( this.filters.page ) - 1 );
		},
		resetPage() {
			if ( this.filters.page === 1 ) {
				this.loadItems();
			} else {
				this.filters.page = 1;
			}
		},
		refresh() {
			this.clearIconStorage();
			this.loadItems();
		},
		resetFilters() {
			// TODO Maybe make this more precise to reduce attempted extra loads
			this.haltRequests = true;
			this.filters = JSON.parse( JSON.stringify( this.default_filters ) );
			this.show_search = false;
			this.show_filters = false;
			this.filtered = false;
			this.$nextTick( () => {
				this.haltRequests = false;
				this.loadItems();
			} );
		},
		getColumns() {
			axios.post( this.route, { get: 'columns' } )
				.then( response => {
					this.columns = response.data;
					this.loadItems();
				} )
				.catch( ( error ) => {
					console.log( 'Error', error );
				} );
		},
		loadItems( initial_load ) {
			if ( this.haltRequests ) {
				return false;
			}
			if ( JSON.stringify( this.filters ) !== JSON.stringify( this.default_filters ) ) {
				this.filtered = true;
			}
			this.loading = true;
			let data = { alpine: this.filters, rule: this.rule };
			if ( initial_load ) {
				data.get = 'columns';
			}
			if ( null !== this.cancelToken ) {
				this.cancelToken.cancel( 'Operation canceled due to new request.' );
			}
			this.cancelToken = axios.CancelToken.source();
			
			axios.post( this.route, data, { cancelToken: this.cancelToken.token } )
				.then( response => {
					if ( response.data.columns ) {
						this.columns = response.data.columns;
					}
					
					this.results = response.data.count;
					this.total_results = response.data.total_count;
					this.from = (this.filters.page - 1) * this.filters.per_page + 1;
					this.to = Math.min( this.results, (this.filters.page * this.filters.per_page) );
					this.max_pages = Math.ceil( this.results / this.filters.per_page );
					
					this.items = response.data.items;
					
					this.$nextTick( () => this.replaceIcons() );
					if ( 'undefined' !== typeof window.feather ) {
						this.$nextTick( window.feather.replace );
					}
				} )
				.catch( ( error ) => {
					console.log( 'Error', error );
				} )
				.finally( () => {
					this.loading = false;
				} );
		},
		pageString() {
			if ( this.items === null ) {
				return '';
			} else if ( !this.results ) {
				return 'No results found';
			}
			let str = '';
			if ( this.max_pages === 1 ) {
				str = 'Showing ' + this.results + (this.results !== 1 ? ' results' : ' result');
			} else {
				str = 'Showing ' + this.from + ' to ' + this.to + ' of ' + this.results + (this.results !== 1 ? ' results' : ' result');
			}
			if ( this.results !== this.total_results ) {
				str += ' (' + this.total_results + ' total)';
			}
			return str;
		},
		format( value, format ) {
			
			if ( 'actions' === format ) {
				return this.render_actions( value );
			}
			
			if ( null === value ) {
				return '';
			} else if ( Array.isArray( value ) ) {
				return value.map( item => this.format( item, format ) ).join( '' );
			} else if ('object' === typeof value) {
				let output = value.value || value[0] || null;
				if (value.link) {
					const tag = document.createElement('a');
					tag.classList.add('hover:underline');
					tag.setAttribute('href', value.link);
					tag.innerHTML = output;
					if ('undefined' !== typeof value.target) {
						tag.setAttribute('target', value.target);
					}
					if ('undefined' !== typeof value.abbr) {
						tag.setAttribute('title', value.abbr);
					}
					output = tag.outerHTML;
				} else if (value.abbr) {
					output = `<abbr title="${value.abbr}">${output}</abbr>`;
				}
				return output;
			}
			
			if ( format instanceof Function ) {
				
				value = format( value );
				
			} else {
				
				switch ( format ) {
					case 'date':
						value = value.split( 'T' )[0];
						break;
					case 'currency':
						value = (new Intl.NumberFormat( 'en-AU', {
							style: 'currency',
							currency: 'AUD'
						} )).format( value );
						break;
				}
				
			}
			
			return value;
		},
		render_actions( actions ) {
			let output = [];
			actions.actions.forEach( action => {
				output.push( '<a href="' + action.link + '" title="' + action.title + '" ' + (action.attributes || '') + '>' +
					('undefined' !== typeof action.feather ? '<i data-feather="' + action.feather + '"></i>' : '') +
					('undefined' !== typeof action.icon ? '<i data-icon="' + action.icon + '"></i>' : '')
					+ '</a>' );
			} );
			return output.join( ' ' );
		},
		render( item, column ) {
			return this.format( item[column.key], column.format );
		},
		clearIconStorage() {
			Object.keys( window.localStorage ).forEach( key => {
				if ( key.substring( 0, 5 ) === 'icon-' ) {
					window.localStorage.removeItem( key );
				}
			} );
			this.$nextTick( () => this.replaceIcons() );
		},
		replaceIcons() {
			document.querySelectorAll( '[data-icon]' ).forEach( $icon => {
				let icon = $icon.getAttribute( 'data-icon' ),
					attributes = $icon.getAttributeNames().reduce( ( acc, name ) => {
						return { ...acc, [name]: $icon.getAttribute( name ) };
					}, {} );
				if ( !icon.includes( '/' ) ) {
					icon = 'outline/' + icon;
				}
				if ( null !== window.localStorage.getItem( 'icon-' + icon ) ) {
					let newElement = document.createElement( 'template' );
					newElement.innerHTML = window.localStorage.getItem( 'icon-' + icon );
					newElement = newElement.content.children[0];
					Object.keys( attributes ).forEach( key => {
						newElement.setAttribute( key, attributes[key] );
					} );
					$icon.replaceWith( newElement );
				} else {
					axios.get( this.app_url + '/vendor/alpine-tables/icons/' + icon + '.svg' )
						.then( result => {
							window.localStorage.setItem( 'icon-' + icon, result.data );
							let newElement = document.createElement( 'template' );
							newElement.innerHTML = result.data;
							newElement = newElement.content.children[0];
							Object.keys( attributes ).forEach( key => {
								newElement.setAttribute( key, attributes[key] );
							} );
							$icon.replaceWith( newElement );
						} );
				}
			} );
		},
		setSort( key ) {
			if ( this.filters.sort_by === key ) {
				this.filters.sort_asc = !this.filters.sort_asc;
			} else {
				this.filters.sort_by = key;
				this.filters.sort_asc = true;
			}
		},
		setFilter( column ) {
			if ( '' === this.filters.filters[column] ) {
				delete this.filters.filters[column];
			}
			this.resetPage();
		},
		toggleSearch() {
			this.show_search = !this.show_search;
			if ( this.show_search ) {
				this.$nextTick( () => {
					this.$refs.search.focus();
				} );
			} else {
				this.filters.search = '';
			}
		}
	};
};
