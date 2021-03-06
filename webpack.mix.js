const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.disableSuccessNotifications()
    .js('resources/js/script.js', 'assets/js/script.js')
    .js('resources/js/app.js', 'assets/js')
    .postCss('resources/css/app.css', 'assets/css/alpinetables.css', [
        require('postcss-import'),
        require('tailwindcss'),
        require('autoprefixer'),
    ]);
