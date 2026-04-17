<?php

namespace S2Hub\CmsPopup\Forms;

use SilverStripe\Forms\FormAction;

class CmsModalAction extends FormAction
{
    protected string $modalComponent = '';

    protected string $modalTitle = '';

    protected array $modalData = [];

    protected string $modalSize = 'md';

    public function __construct(string $action, string $title)
    {
        parent::__construct($action, $title);
        $this->setUseButtonTag(true);
        $this->addExtraClass('cms-modal-action');
    }

    public function setModalComponent(string $component): static
    {
        $this->modalComponent = $component;
        return $this;
    }

    public function getModalComponent(): string
    {
        return $this->modalComponent;
    }

    public function setModalTitle(string $title): static
    {
        $this->modalTitle = $title;
        return $this;
    }

    public function getModalTitle(): string
    {
        return $this->modalTitle ?: $this->Title();
    }

    public function setModalData(array $data): static
    {
        $this->modalData = $data;
        return $this;
    }

    public function getModalData(): array
    {
        return $this->modalData;
    }

    public function setButtonIcon(string $icon): static
    {
        $this->addExtraClass($icon);
        return $this;
    }

    public function setModalSize(string $size): static
    {
        $this->modalSize = $size;
        return $this;
    }

    public function getModalSize(): string
    {
        return $this->modalSize;
    }

    public function getAttributes(): array
    {
        $attrs = parent::getAttributes();
        $attrs['data-modal-component'] = $this->modalComponent;
        $attrs['data-modal-title'] = $this->getModalTitle();
        $attrs['data-modal-data'] = json_encode($this->modalData);
        $attrs['data-modal-size'] = $this->modalSize;
        $attrs['type'] = 'button';
        return $attrs;
    }

    public function getSchemaDataDefaults(): array
    {
        $defaults = parent::getSchemaDataDefaults();
        // Use dedicated React component so clicks are intercepted before
        // FormBuilder.handleAction() can record a form submission action.
        $defaults['component'] = 'CmsModalActionButton';
        // Pass modal config via schema attributes so the React component
        // receives them regardless of which admin section renders the form.
        $defaults['attributes']['data-modal-component'] = $this->modalComponent;
        $defaults['attributes']['data-modal-title'] = $this->getModalTitle();
        $defaults['attributes']['data-modal-data'] = json_encode($this->modalData);
        $defaults['attributes']['data-modal-size'] = $this->modalSize;
        $defaults['attributes']['type'] = 'button';
        return $defaults;
    }

    // phpcs:ignore PSR1.Methods.CamelCapsMethodName.NotCamelCaps -- overrides SilverStripe's FormField::Type()
    public function Type(): string
    {
        return 'cms-modal-action action';
    }
}
