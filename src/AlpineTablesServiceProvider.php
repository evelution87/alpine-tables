<?php

namespace Evelution\AlpineTables;

use Evelution\AlpineTables\Console\Commands\Publish;
use Evelution\AlpineTables\View\AlpineTableComponent;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AlpineTablesServiceProvider extends ServiceProvider {
	/**
	 * Bootstrap the application services.
	 */
	public function boot() {
		
		$this->loadViewsFrom( __DIR__ . '/../resources/views', 'alpine-tables' );
		
		if ( $this->app->runningInConsole() ) {
			
			$this->publishes( [
				__DIR__ . '/../assets' => public_path( 'vendor/alpine-tables' ),
			], 'assets' );
			
			$this->commands( [
				Publish::class,
			] );
			
		} else {
			
			Blade::component( 'alpine-table', AlpineTableComponent::class );
			
		}
		
	}
	
	/**
	 * Register the application services.
	 */
	public function register() {
		// Register the main class to use with the facade
		$this->app->singleton( 'alpine-tables', function() {
			return new AlpineTables;
		} );
	}
}
