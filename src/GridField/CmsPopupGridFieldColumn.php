<?php

namespace S2Hub\CmsPopup\GridField;

use S2Hub\CmsPopup\Admin\CmsPopupAdminController;
use S2Hub\CmsPopup\Handler\CmsPopupHandler;
use SilverStripe\Forms\GridField\GridField_ColumnProvider;
use SilverStripe\ORM\DataObject;

/**
 * GridField column that renders a popup-edit icon button for each row.
 *
 * Usage:
 *   $config->addComponent(new CmsPopupGridFieldColumn(FootnotePopup::class, 'footnoteID', 'Fußnote bearbeiten'));
 */
class CmsPopupGridFieldColumn implements GridField_ColumnProvider
{
    public function __construct(
        protected string $handlerClass,
        protected string $idParam,
        protected string $title = 'Bearbeiten',
        protected string $size = 'lg'
    ) {
    }

    public function augmentColumns($gridField, &$columns): void
    {
        if (!in_array('CmsPopupEdit', $columns, true)) {
            $columns[] = 'CmsPopupEdit';
        }
    }

    public function getColumnsHandled($gridField): array
    {
        return ['CmsPopupEdit'];
    }

    /** @param DataObject $record */
    public function getColumnContent($gridField, $record, $columnName): string
    {
        if (!$record->canEdit()) {
            return '';
        }

        $schemaUrl = CmsPopupAdminController::buildSchemaUrl(
            $this->handlerClass,
            [$this->idParam => $record->ID]
        );

        $identifier = CmsPopupAdminController::buildIdentifier(
            $this->handlerClass,
            ['handler' => $this->handlerClass, $this->idParam => $record->ID]
        );

        $modalData = htmlspecialchars(
            json_encode(['schemaUrl' => $schemaUrl, 'identifier' => $identifier]),
            ENT_QUOTES
        );

        $title = htmlspecialchars($this->title);

        return sprintf(
            '<a href="#" role="button"'
            . ' class="btn btn--no-text btn--icon-md cms-modal-action"'
            . ' data-modal-component="CmsModalFormSchema"'
            . ' data-modal-title="%s"'
            . ' data-modal-data="%s"'
            . ' data-modal-size="%s"'
            . ' title="%s">'
            . '<span class="btn__icon font-icon-edit"></span>'
            . '</a>',
            $title,
            $modalData,
            htmlspecialchars($this->size),
            $title
        );
    }

    /** @param DataObject $record */
    public function getColumnAttributes($gridField, $record, $columnName): array
    {
        return ['class' => 'grid-field__col-compact'];
    }

    public function getColumnMetadata($gridField, $columnName): array
    {
        return ['title' => ''];
    }
}
