<?php

namespace Evelution\AlpineTables\View;

use Illuminate\View\Component;

class AlpineTableComponent extends Component
{
	
	public $tableData;
	
	public function tableData()
	{
		return json_encode( $this->tableData );
	}
	
	public function __construct( $key, $route, $rule = '' )
	{
		$app_url         = config( 'app.url', '' );
		$this->tableData = compact( 'key', 'app_url', 'route', 'rule' );
	}
	
	public function render()
	{
		return view( 'alpine-tables::table' );
	}
	
}
