<?php

namespace Atwx\CmsPopup\Forms;

class CmsModalSearchAction extends CmsModalAction
{
    public function __construct(string $action, string $title)
    {
        parent::__construct($action, $title);
        $this->setModalComponent('CmsModalSearch');
    }

    public function setFormEndpoint(string $url): static
    {
        $this->modalData['formEndpoint'] = $url;
        return $this;
    }

    public function setResultsEndpoint(string $url): static
    {
        $this->modalData['searchEndpoint'] = $url;
        return $this;
    }
}
