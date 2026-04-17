<?php

namespace S2Hub\CmsPopup\Admin;

use S2Hub\CmsPopup\Handler\CmsPopupHandler;
use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;

/**
 * Hidden LeftAndMain controller that provides the /popup endpoint.
 *
 * Using a dedicated LeftAndMain subclass (instead of an extension) means the
 * popup URL is always /admin/cms-popup/popup?handler=…, independent of which
 * admin section (ModelAdmin, CMSPageEditController, …) is currently open.
 *
 * This avoids the ModelAdmin::init() conflict where an extension's `popup`
 * action was mistaken for a managed model class name.
 */
class CmsPopupAdminController extends LeftAndMain
{
    /**
     * @config
     */
    private static string $url_segment = 'cms-popup';

    /**
     * @config
     */
    private static string $menu_title = 'Popup';

    /**
     * @config
     */
    private static int $menu_priority = -1;

    /**
     * @config
     */
    private static bool $ignore_menuitem = true;

    /**
     * @config
     */
    private static array $allowed_actions = ['popup'];

    /**
     * GET  → return FormSchema for the React FormBuilder modal.
     * POST → save submitted data, return updated FormSchema.
     */
    public function popup(HTTPRequest $request): HTTPResponse
    {
        $handlerClass = $request->getVar('handler');

        if (
            !$handlerClass
            || !class_exists($handlerClass)
            || !is_subclass_of($handlerClass, CmsPopupHandler::class)
        ) {
            return $this->httpError(400, 'Invalid or missing handler');
        }

        /** @var CmsPopupHandler $handler */
        $handler = new $handlerClass();
        $record = $handler->getRecord($request);

        if (!$record || !$record->isInDB()) {
            return $this->httpError(404, 'Record not found');
        }

        if (!$handler->canAccess($record)) {
            return $this->httpError(403, 'Access denied');
        }

        $identifier = self::buildIdentifier($handlerClass, $request->getVars());

        $fields = $handler->getFields($record);
        $actions = FieldList::create(
            FormAction::create('save', 'Speichern')->addExtraClass('btn-primary')
        );

        $form = Form::create($this, 'CmsPopupForm', $fields, $actions);

        // Same URL handles both GET (schema) and POST (save)
        $formAction = Director::absoluteURL(
            Controller::join_links($this->Link('popup'))
            . '?' . http_build_query($request->getVars())
        );
        $form->setFormAction($formAction);

        if ($request->isPOST()) {
            $data = $request->postVars();
            $form->loadDataFrom($data);
            $validationResult = $form->validate();
            if ($validationResult->isValid()) {
                $handler->save($record, $data, $form);
            }
            return $this->getSchemaResponse($identifier, $form, $validationResult);
        }

        $form->loadDataFrom($record);
        return $this->getSchemaResponse($identifier, $form);
    }

    /**
     * Build a stable, unique form identifier from handler class + record params.
     */
    public static function buildIdentifier(string $handlerClass, array $vars): string
    {
        $shortName = (new \ReflectionClass($handlerClass))->getShortName();
        $params = $vars;
        unset($params['handler']);
        ksort($params);
        $id = empty($params) ? '' : '_' . implode('_', array_map(
            fn($k, $v) => "{$k}-{$v}",
            array_keys($params),
            array_values($params)
        ));
        return $shortName . $id;
    }

    /**
     * Build the absolute popup schema URL for a given handler + record params.
     *
     * @param array<string,mixed> $params  Record-identifying query params, e.g. ['pageID' => 42]
     */
    public static function buildSchemaUrl(string $handlerClass, array $params = []): string
    {
        $link = Director::absoluteURL(
            Controller::join_links(static::singleton()->Link('popup'))
        );
        return $link . '?' . http_build_query(array_merge(['handler' => $handlerClass], $params));
    }
}
