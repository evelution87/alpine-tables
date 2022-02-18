<?php

namespace Evelution\AlpineTables\View;

use Illuminate\View\Component;

class AlpineTableComponent extends Component {
	
	public $tableData;
	//public $key, $route;
	
	public function tableData() {
		//return json_encode( compact( 'key', 'route' ) );
		return json_encode( $this->tableData );
	}
	
	public function __construct( $key, $route ) {
		//$this->tableData = $tableData;
		$this->tableData = compact( 'key', 'route' ) ;
		//$this->key   = $key;
		//$this->route = $route;
	}
	
	public function render() {
		return view( 'alpine-tables::table' );
	}
	
}