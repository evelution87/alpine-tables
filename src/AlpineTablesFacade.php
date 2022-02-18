<?php

namespace Evelution\AlpineTables;

use Illuminate\Support\Facades\Facade;

class AlpineTablesFacade extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'alpine-tables';
    }
}
