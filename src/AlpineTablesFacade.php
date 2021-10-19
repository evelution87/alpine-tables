<?php

namespace Evelution87\AlpineTables;

use Illuminate\Support\Facades\Facade;

/**
 * @see \Evelution87\AlpineTables\Skeleton\SkeletonClass
 */
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
