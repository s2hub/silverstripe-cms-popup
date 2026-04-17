<?php

namespace S2Hub\CmsPopup\Handler;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\ORM\DataObject;

/**
 * Base class for CMS popup form handlers.
 *
 * Subclass this to define a popup: resolve the record, declare fields,
 * and optionally customise save logic. Connect a button to the handler
 * via CmsModalFormSchemaAction::forHandler() or CmsPopupGridFieldColumn.
 */
abstract class CmsPopupHandler
{
    /**
     * Resolve the DataObject to edit from the incoming HTTP request.
     * Typically reads an ID from a GET parameter and fetches the record.
     */
    abstract public function getRecord(HTTPRequest $request): DataObject;

    /**
     * Return the FieldList to display inside the popup form.
     */
    abstract public function getFields(DataObject $record): FieldList;

    /**
     * Save submitted form data into the record.
     * Default: saveInto() + write(). Override for custom logic.
     */
    public function save(DataObject $record, array $data, Form $form): void
    {
        $form->saveInto($record);
        $record->write();
    }

    /**
     * Check whether the current user may open/submit this popup.
     * Default: delegates to DataObject::canEdit().
     */
    public function canAccess(DataObject $record): bool
    {
        return (bool) $record->canEdit();
    }
}
