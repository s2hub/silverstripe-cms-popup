<?php

namespace S2Hub\CmsPopup\Extensions;

use S2Hub\CmsPopup\Admin\CmsPopupAdminController;
use SilverStripe\Core\Extension;

/**
 * @deprecated Use CmsPopupAdminController::buildSchemaUrl() and buildIdentifier() directly.
 *
 * Kept as a compatibility shim; the `popup` action has moved to CmsPopupAdminController
 * to avoid the ModelAdmin::init() conflict where the action name was mistaken for a
 * managed model class.
 */
class CmsPopupRouterExtension extends Extension
{
    /**
     * @deprecated Use CmsPopupAdminController::buildIdentifier()
     */
    public static function buildIdentifier(string $handlerClass, array $vars): string
    {
        return CmsPopupAdminController::buildIdentifier($handlerClass, $vars);
    }

    /**
     * @deprecated Use CmsPopupAdminController::buildSchemaUrl()
     */
    public static function buildSchemaUrl(string $controllerLink, string $handlerClass, array $params = []): string
    {
        return CmsPopupAdminController::buildSchemaUrl($handlerClass, $params);
    }
}
