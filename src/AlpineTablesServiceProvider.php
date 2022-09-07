<?php

namespace Evelution\AlpineTables;

use Evelution\AlpineTables\Console\Commands\Publish;
use Evelution\AlpineTables\View\AlpineTableComponent;
use Evelution\AlpineTables\Macros\PluckMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AlpineTablesServiceProvider extends ServiceProvider
{
	/**
	 * Bootstrap the application services.
	 */
	public function boot()
	{
		
		$this->loadViewsFrom( __DIR__ . '/../resources/views', 'alpine-tables' );
		
		if ( $this->app->runningInConsole() ) {
			
			$this->publishes( [
				base_path() . '/vendor/evelution87/heroicons/optimized/24' => __DIR__ . '/../assets/icons',
				__DIR__ . '/../assets'                                     => public_path( 'vendor/alpine-tables' ),
			], 'alpine-tables' );
			
			$this->commands( [
				Publish::class,
			] );
			
		} else {
			
			Blade::component( 'alpine-table', AlpineTableComponent::class );
			
			$this->registerMacros();
			
		}
		
	}
	
	/**
	 * Register necessary macros
	 */
	public function registerMacros()
	{
		foreach ( [
			          'pluckMany' => PluckMany::class,
		          ] as $macro => $class ) {
			Collection::macro( $macro, app( $class )() );
		}
	}
	
	/**
	 * Register the application services.
	 */
	public function register()
	{
		// Register the main class to use with the facade
		$this->app->singleton( 'alpine-tables', function() {
			return new AlpineTables;
		} );
	}
}
