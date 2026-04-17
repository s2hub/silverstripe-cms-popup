<?php

namespace S2Hub\CmsPopup\Forms;

use S2Hub\CmsPopup\Admin\CmsPopupAdminController;

/**
 * Convenience action for opening a SilverStripe FormSchema inside the modal.
 *
 * The FormSchema is loaded via FormBuilderLoader, which supports all CMS field
 * types including HTMLEditorField (TinyMCE). The modal closes automatically
 * after a successful save.
 *
 * The PHP endpoint must be a LeftAndMain action that calls
 * $this->getSchemaResponse($identifier, $form) and accepts both GET (schema
 * request) and POST (form submission).
 *
 * Usage (manual):
 *
 *   CmsModalFormSchemaAction::create('editRecord', 'Record bearbeiten')
 *       ->setSchemaUrl('/admin/pages/myPopupForm?recordID=' . $this->ID)
 *       ->setFormIdentifier('myPopup_' . $this->ID)
 *       ->setModalTitle('Record bearbeiten')
 *       ->setModalSize('md');
 *
 * Usage (with CmsPopupHandler — URL and identifier are generated automatically):
 *
 *   CmsModalFormSchemaAction::forHandler(MyPopup::class, ['recordID' => $this->ID])
 *       ->setModalTitle('Record bearbeiten')
 *       ->setModalSize('md');
 */
class CmsModalFormSchemaAction extends CmsModalAction
{
    public function __construct(string $action, string $title = '')
    {
        parent::__construct($action, $title);
        $this->setModalComponent('CmsModalFormSchema');
    }

    /**
     * URL of the LeftAndMain action that returns the form schema.
     * Must accept GET (with X-FormSchema-Request header) and POST.
     */
    public function setSchemaUrl(string $url): static
    {
        $this->modalData['schemaUrl'] = $url;
        return $this;
    }

    /**
     * Stable unique key for the Redux form state.
     * Use a record-specific value, e.g. 'myPopup_' . $record->ID.
     * Defaults to the schemaUrl if omitted.
     */
    public function setFormIdentifier(string $identifier): static
    {
        $this->modalData['identifier'] = $identifier;
        return $this;
    }

    /**
     * Factory: connect this action to a CmsPopupHandler subclass.
     * Automatically generates the schemaUrl and form identifier.
     *
     * @param class-string<\S2Hub\CmsPopup\Handler\CmsPopupHandler> $handlerClass
     * @param array<string,mixed> $params  Record-identifying query params, e.g. ['pageID' => $this->ID]
     */
    public static function forHandler(string $handlerClass, array $params = [], string $title = ''): static
    {
        $schemaUrl = CmsPopupAdminController::buildSchemaUrl($handlerClass, $params);
        $identifier = CmsPopupAdminController::buildIdentifier(
            $handlerClass,
            array_merge(['handler' => $handlerClass], $params)
        );

        $shortName = (new \ReflectionClass($handlerClass))->getShortName();
        $actionName = 'popup_' . strtolower($shortName);

        return static::create($actionName, $title)
            ->setSchemaUrl($schemaUrl)
            ->setFormIdentifier($identifier);
    }
}
