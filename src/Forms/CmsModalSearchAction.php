<?php

namespace S2Hub\CmsPopup\Forms;

use S2Hub\CmsPopup\Control\CmsPopupSearchRouterController;

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

    /**
     * Factory: create a CmsModalSearchAction pre-configured for a CmsPopupSearchHandler subclass.
     */
    public static function forHandler(string $handlerClass): static
    {
        $endpoints = CmsPopupSearchRouterController::endpointsForHandler($handlerClass);
        $shortName = (new \ReflectionClass($handlerClass))->getShortName();
        return static::create('search_' . strtolower($shortName), '')
            ->setFormEndpoint($endpoints['searchForm'])
            ->setResultsEndpoint($endpoints['searchResults']);
    }
}
