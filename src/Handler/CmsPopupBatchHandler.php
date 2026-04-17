<?php

namespace S2Hub\CmsPopup\Handler;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Forms\FieldList;

abstract class CmsPopupBatchHandler
{
    /**
     * Form fields shown before the batch starts (e.g. locale checkboxes).
     * Default: empty form.
     */
    public function getBatchFormFields(): FieldList
    {
        return FieldList::create();
    }

    /**
     * Queue items to pre-populate the batch queue (e.g. child pages).
     * Default: empty — caller builds the queue manually via setBaseQueue().
     *
     * @return array Array of items: [{id, title, className, depth?, enabled?, disabledReason?}]
     */
    public function getQueueItems(HTTPRequest $request): array
    {
        return [];
    }

    /**
     * Process a single batch queue item. Must return a JSON HTTPResponse
     * with at least {id, title, className, status, message, details}.
     */
    abstract public function processItem(HTTPRequest $request): HTTPResponse;
}
