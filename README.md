# AlpineJS Data Tables for Laravel

[![Latest Version on Packagist](https://img.shields.io/packagist/v/evelution87/alpine-tables.svg?style=flat-square)](https://packagist.org/packages/evelution87/alpine-tables)
[![Total Downloads](https://img.shields.io/packagist/dt/evelution87/alpine-tables.svg?style=flat-square)](https://packagist.org/packages/evelution87/alpine-tables)
![GitHub Actions](https://github.com/evelution87/alpine-tables/actions/workflows/main.yml/badge.svg)

This package provides a component for Laravel websites to embed data tables using AlpineJS and Tailwind CSS.

## Installation

You can install the package via composer:

```bash
composer require evelution87/alpine-tables
```

The required assets must be published by running:

```bash
php artisan alpinetables:publish
```

## Usage

Alpine Tables can be enabled for a controller by adding a trait to the controller.

```php
use \Evelution\AlpineTables\Traits\HasAlpineTable;
```

You must include your own version of two functions:

`alpineModel()` defines the Laravel model the table will be using.
Replace 'User' with the model the table will be working with.
```php
public function alpineModel() {
    return User::class;
}
```

`alpineColumns()` defines the columns that will appear on the table.
(documentation to be added later)
```php
public function alpineColumns() {
    return [
        [
            'key'   => 'name',
            'label' => 'Name',
        ],
    ];
}
```

Optional:
`alpineSearchColumns()` can be used to define the columns that can be searched. By default it returns a list of all columns defined by `alpineColumns()`, but you might want to customise this.

### Adding to a View
To insert a table into a view, you can use the `<x-alpine-table>` blade component.
```blade
<x-alpine-table route="{{ route('ajax.alpine.example') }}" key="example"></x-alpine-table>
```
* The `route` attribute defines the AJAX route for loading table data. This route should be defined in your `routes.php` file. Example: 
```php
Route::post('ajax/example' [ ExampleController::class, 'alpineRequest'] );
```

* The (optional) `key` attribute is used when saving settings such as filters to a user's local browser storage. Use a different key for each table to allow different filters to be saved. Alternatively you can use the same key to make the filters function across different tables.


## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

### Security

If you discover any security related issues, please email craig@evelution.net instead of using the issue tracker.

## Credits

-   [Craig Eve](https://github.com/evelution87)
-   [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

## Laravel Package Boilerplate

This package was generated using the [Laravel Package Boilerplate](https://laravelpackageboilerplate.com).
