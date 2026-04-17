<?php

namespace S2Hub\CmsPopup\Control;

use S2Hub\CmsPopup\Handler\CmsPopupBatchHandler;
use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Security\Permission;
use SilverStripe\Security\Security;

class CmsPopupBatchRouterController extends Controller
{
    /**
     * @config
     */
    private static string $url_segment = 'cms-batch';

    /**
     * @config
     */
    private static array $allowed_actions = [
        'batchForm',
        'batchQueue',
        'batchExecute',
    ];

    protected function init(): void
    {
        parent::init();
        if (!Security::getCurrentUser() || !Permission::check('CMS_ACCESS_CMSMain')) {
            $this->httpError(403, 'Forbidden');
        }
    }

    /**
     * Returns the batch form as HTML for the CmsModalBatch React component.
     */
    public function batchForm(HTTPRequest $request): HTTPResponse
    {
        $handler = $this->resolveHandler($request);
        $fields = $handler->getBatchFormFields();
        $form = Form::create($this, 'batchForm', $fields, FieldList::create());
        $form->disableSecurityToken();

        return $this->htmlResponse((string) $form->forTemplate());
    }

    /**
     * Returns queue items as JSON for the CmsModalBatch React component.
     */
    public function batchQueue(HTTPRequest $request): HTTPResponse
    {
        $handler = $this->resolveHandler($request);
        $items = $handler->getQueueItems($request);
        return $this->jsonResponse(['items' => $items]);
    }

    /**
     * Processes a single batch item. Delegates entirely to the handler.
     */
    public function batchExecute(HTTPRequest $request): HTTPResponse
    {
        if (!$request->isPOST()) {
            return $this->jsonResponse(['error' => 'POST required'], 405);
        }

        $handler = $this->resolveHandler($request);
        return $handler->processItem($request);
    }

    /**
     * Returns absolute endpoint URLs for a given handler class.
     *
     * @return array{form: string, execute: string, queue: string}
     */
    public static function endpointsForHandler(string $handlerClass, array $params = []): array
    {
        $controller = static::singleton();
        $qs = '?' . http_build_query(['handler' => $handlerClass]);
        return [
            'form' => Director::absoluteURL($controller->Link('batchForm')) . $qs,
            'execute' => Director::absoluteURL($controller->Link('batchExecute')) . $qs,
            'queue' => empty($params)
                ? ''
                : Director::absoluteURL($controller->Link('batchQueue')) . $qs . '&' . http_build_query($params),
        ];
    }

    private function resolveHandler(HTTPRequest $request): CmsPopupBatchHandler
    {
        $class = $request->getVar('handler');
        if (!$class || !is_subclass_of($class, CmsPopupBatchHandler::class)) {
            $this->httpError(400, 'Invalid or missing handler');
        }

        return new $class();
    }

    private function htmlResponse(string $html, int $status = 200): HTTPResponse
    {
        return HTTPResponse::create()
            ->setStatusCode($status)
            ->addHeader('Content-Type', 'text/html; charset=utf-8')
            ->setBody($html);
    }

    private function jsonResponse(array $data, int $status = 200): HTTPResponse
    {
        return HTTPResponse::create()
            ->setStatusCode($status)
            ->addHeader('Content-Type', 'application/json')
            ->setBody((string) json_encode($data));
    }
}
