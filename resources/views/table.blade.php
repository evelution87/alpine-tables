<script>
    let data = {!! $tableData() !!};
</script>

<div x-data="alpinetable(data)">

    <div class="flex justify-end items-center space-x-4 mb-3 text-gray-700">
        {{--<div class="opacity-0 transition" :class="{'opacity-100':show_search || filters.search.length}">--}}
        <div x-show="show_search || filters.search.length" x-transition.opacity>
            <label for="search">Search: </label>
            <input type="text" x-model.debounce="filters.search" x-ref="search" id="search" class="bg-transparent outline-none border-0 border-b-2 border-gray-200 focus:ring-0 p-0" />
        </div>
        <div class="relative">
            <div class="flex border border-gray-200 rounded-md divide-x divide-gray-200 overflow-hidden">
                <div class="p-2 transition cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-50" x-on:click="toggleSearch">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" x-show="!show_search" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" x-show="show_search" />
                    </svg>
                </div>
                <div class="p-2 transition cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-50" x-on:click="show_filters = !show_filters">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                </div>
            </div>
            <div class="absolute top-full right-0 bg-white rounded-md shadow-sm p-3" x-show="show_filters" x-transition x-on:click.outside="show_filters=false">
                <div class="whitespace-nowrap">
                    Results per Page:
                    <select x-model="filters.per_page">
                        <template x-for="per_page in [1,2,3,10,25,50,100]">
                            <option x-text="per_page" :selected="filters.per_page === per_page.toString()"></option>
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
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div class="flex items-center hover:text-gray-700 cursor-pointer">
                            <span :class="{'sr-only':column.sr_only||false}" x-text="column.label" x-on:click="setSort(column.key)"></span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" x-on:click="setSort(column.key)" :class="{'opacity-0':filters.sort_by !== column.key}">
                                <path x-show="filters.sort_asc" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                <path x-show="!filters.sort_asc" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                            </svg>
                        </div>
                    </th>
                </template>

            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 text-gray-900 text-sm">

            <template x-for="item in items" :key="item.id">
                <tr class="hover:bg-gray-50">

                    <template x-for="column in columns">
                        <td class="px-6 py-4 whitespace-nowrap" :class="column.class || ''" x-html="render(item,column)"></td>
                    </template>

                </tr>
            </template>

            </tbody>
        </table>
    </div>

    <div class="flex justify-between mt-3 text-gray-700">
        <div>
            <div x-show="loading" class="flex items-center">
                <svg class="animate-spin mr-2 h-5 w-5 text-lime-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading</span>
            </div>
            <div x-show="!loading" x-text="pageString()" class="text-sm"></div>
        </div>
        <template x-if="max_pages > 1">
            <div class="flex border border-gray-200 rounded-md divide-x divide-gray-200 overflow-hidden">
                <div class="p-2 transition" x-on:click="pageDown" :class="Number(filters.page) === 1 ? 'text-gray-200':'cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-50'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </div>
                <div>
                    <select x-model="filters.page" class="border-none focus:ring-0 cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                        <template x-for="page in max_pages">
                            <option x-text="page" :selected="Number(filters.page) === Number(page)"></option>
                        </template>
                    </select>
                </div>
                <div class="p-2 transition" x-on:click="pageUp" :class="Number(filters.page) === Number(max_pages) ? 'text-gray-200':'cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-50'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </template>
    </div>

</div>