<?php

namespace Atwx\CmsPopup\Forms;

class CmsModalBatchAction extends CmsModalAction
{
    public function __construct(string $action, string $title)
    {
        parent::__construct($action, $title);
        $this->setModalComponent('CmsModalBatch');
    }

    public function setFormEndpoint(string $url): static
    {
        $this->modalData['formEndpoint'] = $url;
        return $this;
    }

    public function setActionEndpoint(string $url): static
    {
        $this->modalData['actionEndpoint'] = $url;
        return $this;
    }

    public function setQueueEndpoint(string $url): static
    {
        $this->modalData['queueEndpoint'] = $url;
        return $this;
    }

    public function setSubmitLabel(string $label): static
    {
        $this->modalData['submitLabel'] = $label;
        return $this;
    }

    public function setBaseQueue(array $queue): static
    {
        $this->modalData['baseQueue'] = $queue;
        return $this;
    }
}
