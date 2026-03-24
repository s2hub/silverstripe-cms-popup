<?php

namespace Atwx\CmsPopup\Forms;

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

    /**
     * @param string $size sm|md|lg
     */
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
        // type=button prevents CMS form submission on click
        $attrs['type'] = 'button';
        return $attrs;
    }

    public function Type(): string
    {
        return 'cms-modal-action action';
    }
}
