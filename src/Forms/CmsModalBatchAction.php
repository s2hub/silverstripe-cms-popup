<?php

namespace S2Hub\CmsPopup\Forms;

use S2Hub\CmsPopup\Control\CmsPopupBatchRouterController;

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

    /**
     * Factory: create a CmsModalBatchAction pre-configured for a CmsPopupBatchHandler subclass.
     * Pass $params to also populate the queue endpoint (e.g. ['ClassName' => ..., 'ID' => ...]).
     */
    public static function forHandler(string $handlerClass, array $params = [], string $title = ''): static
    {
        $endpoints = CmsPopupBatchRouterController::endpointsForHandler($handlerClass, $params);
        $shortName = (new \ReflectionClass($handlerClass))->getShortName();
        return static::create('batch_' . strtolower($shortName), $title)
            ->setFormEndpoint($endpoints['form'])
            ->setActionEndpoint($endpoints['execute'])
            ->setQueueEndpoint($endpoints['queue']);
    }
}
