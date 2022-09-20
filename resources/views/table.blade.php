<script>
	let data = {!! $tableData() !!};
</script>

<div x-data="alpinetable(data)">
	
	<div class="flex justify-end items-center space-x-4 mb-3 text-gray-700">
		<div class="flex-grow">
			<div x-show="loading" class="flex items-center">
				<svg class="animate-spin mr-2 h-5 w-5 text-lime-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor"
					      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<span>Loading</span>
			</div>
			<div x-show="!loading" x-text="pageString()" class="text-sm"></div>
		</div>
		<div x-show="show_search || filters.search.length" x-transition.opacity>
			<label for="search">Search: </label>
			<input type="text" x-model.debounce="filters.search" x-ref="search" id="search"
			       class="bg-transparent outline-none border-0 border-b-2 border-gray-200 focus:ring-0 p-0"/>
		</div>
		<div class="relative toolbar">
			<div class="flex border border-gray-200 rounded-md divide-x divide-gray-200 overflow-hidden">
				<a :title="show_search ? 'Cancel Search':'Search'" class="p-2 transition cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-50"
				   x-on:click="toggleSearch">
					<i data-icon="magnifying-glass" x-show="!show_search"></i>
					<i data-icon="x-mark" x-show="show_search"></i>
				</a>
				<a title="Filters" class="p-2 transition cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-50" x-on:click="show_filters = !show_filters">
					<i data-icon="adjustments-vertical"></i>
				</a>
				<a title="Reset Filters & Search" class="p-2 transition cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-50" x-show="filtered"
				   x-on:click="resetFilters">
					<i data-icon="arrow-uturn-left"></i>
				</a>
				<a title="Refresh" class="p-2 transition cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-50" x-on:click="refresh">
					<i data-icon="arrow-path"></i>
				</a>
			</div>
			<div class="absolute top-full right-0 bg-white rounded-md shadow-sm p-3" x-show="show_filters" x-transition x-on:click.outside="show_filters=false">
				<div class="whitespace-nowrap">
					Results per Page:
					<select x-model="filters.per_page">
						<template x-for="per_page in [10,25,50,100]">
							<option x-text="per_page" :selected="filters.per_page.toString() === per_page.toString()"></option>
						</template>
					</select>
				</div>
				<template x-for="column in columns">
					<template x-if="'undefined' !== typeof column.filter">
						<div class="whitespace-nowrap">
							<span x-text="column.label"></span>: <select x-model="filters.filters[column.key]" x-on:change="setFilter(column.key)">
								<option value="">Select</option>
								<template x-for="(text,value) in column.filter">
									<option :value="value" x-text="text" :selected="filters.filters[column.key] === value.toString()"></option>
								</template>
							</select>
						</div>
					</template>
				</template>
			</div>
		</div>
	</div>
	
	<div class="rounded-md border border-gray-200 overflow-hidden" x-show="results">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
			<tr>
				
				<template x-for="column in columns">
					<th scope="col" class="px-3 first:pl-5 last:pr-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						<div class="flex items-center hover:text-gray-700 cursor-pointer">
							<span :class="{'sr-only':column.sr_only||false}" x-text="column.label" x-on:click="setSort(column.key)"></span>
							<div x-on:click="setSort(column.key)" :class="{'opacity-0':filters.sort_by !== column.key}">
								<i data-icon="arrow-small-up" class="w-4 h-4 stroke-2" x-show="filters.sort_asc"></i>
								<i data-icon="arrow-small-down" class="w-4 h-4 stroke-2" x-show="!filters.sort_asc"></i>
							</div>
						</div>
					</th>
				</template>
			
			</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200 text-gray-900 text-sm">
			
			<template x-for="item in items" :key="item.id">
				<tr class="hover:bg-gray-50">
					
					<template x-for="column in columns">
						<td class="px-3 first:pl-5 last:pr-5 py-3" :class="column.class || ''" x-html="render(item,column)"></td>
					</template>
				
				</tr>
			</template>
			
			</tbody>
		</table>
	</div>
	
	<div class="flex justify-between mt-3 text-gray-700 toolbar">
		<div>
			<div x-show="loading" class="flex items-center">
				<svg class="animate-spin mr-2 h-5 w-5 text-lime-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor"
					      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<span>Loading</span>
			</div>
			<div x-show="!loading" x-text="pageString()" class="text-sm"></div>
		</div>
		<template x-if="max_pages > 1">
			<div class="flex border border-gray-200 rounded-md divide-x divide-gray-200 overflow-hidden">
				<div class="p-2 transition" x-on:click="pageDown"
				     :class="Number(filters.page) === 1 ? 'text-gray-200':'cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-50'">
					<i data-icon="chevron-left"></i>
				</div>
				<div>
					<select x-model="filters.page" class="border-none focus:ring-0 cursor-pointer text-gray-500 hover:text-gray-700 bg-transparent hover:bg-gray-50">
						<template x-for="page in max_pages">
							<option x-text="page" :selected="Number(page) === Number(filters.page)"></option>
						</template>
					</select>
				</div>
				<div class="p-2 transition" x-on:click="pageUp"
				     :class="Number(filters.page) === Number(max_pages) ? 'text-gray-200':'cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-50'">
					<i data-icon="chevron-right"></i>
				</div>
			</div>
		</template>
	</div>

</div>
