<?php

namespace Evelution87\AlpineTables;

use Evelution87\AlpineTables\View\AlpineTableComponent;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AlpineTablesServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     */
    public function boot()
    {
        /*
         * Optional methods to load your package assets
         */
        // $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'alpine-tables');
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'alpine-tables');
        // $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        // $this->loadRoutesFrom(__DIR__.'/routes.php');
	    
	    $this->registerRoutes();

        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/config.php' => config_path('alpine-tables.php'),
            ], 'config');

            // Publishing the views.
            /*$this->publishes([
                __DIR__.'/../resources/views' => resource_path('views/vendor/alpine-tables'),
            ], 'views');*/

            // Publishing assets.
            $this->publishes([
                __DIR__.'/../assets' => public_path('vendor/alpine-tables'),
            ], 'assets');

            // Publishing the translation files.
            /*$this->publishes([
                __DIR__.'/../resources/lang' => resource_path('lang/vendor/alpine-tables'),
            ], 'lang');*/

            // Registering package commands.
            // $this->commands([]);
        } else {
	
	        Blade::component('alpine-table', AlpineTableComponent::class);
        	
        }
        
    }
	
	protected function registerRoutes() {
		Route::middleware( [ 'web' ] )->group( function() {
			$this->loadRoutesFrom( __DIR__ . '/routes.php' );
		} );
	}

    /**
     * Register the application services.
     */
    public function register()
    {
        // Automatically apply the package configuration
        $this->mergeConfigFrom(__DIR__.'/../config/config.php', 'alpine-tables');

        // Register the main class to use with the facade
        $this->app->singleton('alpine-tables', function () {
            return new AlpineTables;
        });
    }
}
