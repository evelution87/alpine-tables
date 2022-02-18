<?php

namespace Evelution\AlpineTables\Console\Commands;

use Illuminate\Console\Command;

class Publish extends Command {
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'alpinetables:publish';
	
	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Publishes Alpine Tables assets';
	
	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct() {
		parent::__construct();
	}
	
	/**
	 * Execute the console command.
	 *
	 * @return int
	 */
	public function handle() {
		
		$this->info( 'Publishing AlpineTables Assets' );
		
		$this->call( 'vendor:publish', [
			'--provider' => 'Evelution\AlpineTables\AlpineTablesServiceProvider',
			'--force'    => true,
		] );
		
		return 0;
	}
}
