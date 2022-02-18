<?php

namespace Evelution\AlpineTables\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

use Illuminate\Support\Str;

trait HasAlpineTable {
	
	abstract public function alpineModel();
	
	abstract public function alpineColumns();
	
	abstract public function alpineSearchColumns();
	
	public function alpineScope( $query ) {
		return $query;
	}
	
	public function _alpineColumns() {
		return collect( $this->alpineColumns() )->pluckMany( [ 'key', 'label', 'filter', 'class', 'format' ] );
	}
	
	public function alpine( Request $request ) {
		
		$alpine = (object)( $request->alpine ?? [] );
		
		$page     = $alpine->page ?? 1;
		$per_page = $alpine->per_page ?? 25;
		$search   = $alpine->search ?? false;
		$filters  = $alpine->filters ?? [];
		
		$sort_by  = $alpine->sort_by ?? null;
		$sort_asc = $alpine->sort_asc ?? true;
		
		$skip = ( max( 0, $page - 1 ) * $per_page );
		
		$model_classname = $this->alpineModel();
		$model         = new $model_classname;
		$model_columns = $model->getConnection()->getSchemaBuilder()->getColumnListing( $model->getTable() );
		$columns       = collect( $this->alpineColumns() );
		$post_query    = false;
		$post_sort     = false;
		$query_search  = true;
		
		// Prepare Search
		$search_columns = [];
		foreach ( $this->alpineSearchColumns() as $column => $searchable ) {
			$search_columns[ $column ] = $searchable;
			if ( !in_array( $column, $model_columns ) && count( explode( '.', $column ) ) === 1 ) {
				$query_search = false;
				$post_query   = true;
			}
		}
		
		// Get initial query object
		$items = $model::query();
		
		$items = $this->alpineScope( $items );
		
		// Get total count (before any filtering or searching)
		$total_count = $items->count();
		
		// Query Filters
		foreach ( $filters as $filter => $value ) {
			if ( $column = $columns->firstWhere( 'key', $filter ) ) {
				if ( isset( $column['query'] ) ) {
					if ( true === $column['query'] ) {
						$items->where( $filter, $value );
					} else if ( is_scalar( $column['query'] ) ) {
						$items->where( $column['query'], $value );
					} else if ( is_callable( $column['query'] ) ) {
						$column['query']( $items, $value );
					}
				} else if ( isset( $column['collection'] ) ) {
					$post_query = true;
				}
			}
		}
		
		// Query Search
		if ( !empty( $search ) && $query_search && !empty( $search_columns ) ) {
			$items->where( function( $query ) use ( $search_columns, $search ) {
				foreach ( $search_columns as $column => $searchable ) {
					if ( count( $relation = explode( '.', $column ) ) > 1 ) {
						$query->orWhereHas( $relation[0], function( Builder $query ) use ( $relation, $search ) {
							$query->where( $relation[1], 'like', '%' . $search . '%' );
						} );
					} else {
						$query->orWhere( $column, 'like', '%' . $search . '%' );
					}
				}
			} );
		}
		
		// Query sorting
		if ( !is_null( $sort_by ) ) {
			if ( in_array( $sort_by, $model_columns ) ) {
				$items = $items->orderBy( $sort_by, $sort_asc ? 'asc' : 'desc' );
			} else {
				$post_sort = true;
			}
		}
		
		/**
		 * INFO
		 * At this point, if there's any filtering, searching, or sorting based on data that isn't in the database,
		 * the query will be retrieved from the database, and all future filtering, searching, and sorting will be based on the collection instead.
		 *
		 * If no collection filtering, searching, or sorting is needed, the next couple of if statements will be skipped and the count and pagination will use the query.
		 */
		
		if ( !$query_search || $post_query || $post_sort ) {
			// If collection filtering, searching, or sorting is required, do the query to get the collection (not paginated) for further filtering/sorting
			$items = $items->get();
		}
		
		// Collection Filters
		if ( $post_query ) {
			foreach ( $filters as $filter => $value ) {
				if ( $column = $columns->firstWhere( 'key', $filter ) ) {
					if ( isset( $column['collection'] ) ) {
						if ( true === $column['collection'] ) {
							$items->where( $filter, $value );
						} else if ( is_scalar( $column['collection'] ) ) {
							$items->where( $column['collection'], $value );
						} else if ( is_callable( $column['collection'] ) ) {
							$column['collection']( $items, $value );
						}
					}
				}
			}
		}
		
		// Collection Search
		if ( !empty( $search ) && !$query_search && !empty( $search_columns ) ) {
			$items = $items->filter( function( $item ) use ( $search_columns, $search ) {
				$matches = false;
				foreach ( $search_columns as $column => $searchable ) {
					if ( true === $searchable ) {
						$matches = Str::of( $item->{$column} )->lower()->contains( strtolower( $search ) );
					} else if ( is_callable( $searchable ) ) {
						// If $searchable is a callback and returns true, then it's a match
						$matches = $searchable( $item, $search );
					}
					if ( $matches ) {
						break;
					}
				}
				return $matches;
			} );
		}
		
		// Post-query sorting
		if ( $post_sort && !is_null( $sort_by ) ) {
			// TODO Work out how this functions on a relation column
			$items = $items->sortBy( $sort_by, SORT_NATURAL, !$sort_asc );
		}
		
		// Will either count using SQL, or count collection items, depending on post query filtering/sorting
		$count = $items->count();
		
		// Pagination happens after filtering/sorting, or gets added to the query if no post query filtering/sorting happened
		$items = $items->skip( $skip )->take( $per_page );
		
		// If no post query filtering or sorting happened, do the query here to get the collection (paginated using SQL)
		if ( $items instanceof Builder ) {
			$items = $items->get();
		}
		
		$items = $items->map( function( $item ) {
			return method_exists( $item, 'toAlpineTable' ) ? $item->toAlpineTable() : $item->toArray();
		} )->values()->toArray();
		
		$return = [
			'total_count' => $total_count, // Total number of results (unfiltered)
			'count'       => $count, // Total number of filtered results (not paginated)
			'items'       => $items, // The data payload
		];
		
		switch ( $request->get ?? null ) {
			case 'columns':
				$return['columns'] = $this->_alpineColumns();
			break;
		}
		
		if ( config( 'app.debug', false ) ) {
			$return['debug'] = compact( 'page', 'per_page', 'skip', 'sort_by', 'sort_asc' );
		}
		
		return $return;
		
	}
	
}