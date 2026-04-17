<?php

namespace S2Hub\CmsPopup\Handler;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;

abstract class CmsPopupSearchHandler
{
    /**
     * Form fields for the search modal (default: single text field 'q').
     */
    public function getSearchFormFields(): FieldList
    {
        return FieldList::create(
            TextField::create('q', _t(self::class . '.SEARCH', 'Suche'))
        );
    }

    /**
     * Execute a search and return the results as an HTML string.
     * Items that can be selected must have a data-cms-select attribute
     * containing JSON with the item data.
     */
    abstract public function search(string $query, HTTPRequest $request): string;

    /**
     * Minimum query length before search is executed.
     */
    public function getMinQueryLength(): int
    {
        return 2;
    }
}
