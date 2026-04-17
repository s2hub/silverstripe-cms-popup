<?php

namespace S2Hub\CmsPopup\Control;

use S2Hub\CmsPopup\Handler\CmsPopupSearchHandler;
use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Security\Security;

class CmsPopupSearchRouterController extends Controller
{
    /**
     * @config
     */
    private static string $url_segment = 'cms-search';

    /**
     * @config
     */
    private static array $allowed_actions = [
        'searchForm',
        'searchResults',
    ];

    protected function init(): void
    {
        parent::init();
        if (!Security::getCurrentUser()) {
            $this->httpError(403, 'Forbidden');
        }
    }

    /**
     * Returns the search form as HTML for the CmsModalSearch React component.
     */
    public function searchForm(HTTPRequest $request): HTTPResponse
    {
        $handler = $this->resolveHandler($request);
        $fields = $handler->getSearchFormFields();
        $form = Form::create($this, 'searchForm', $fields, FieldList::create());
        $form->setFormMethod('GET');
        $form->disableSecurityToken();

        return $this->htmlResponse((string) $form->forTemplate());
    }

    /**
     * Returns search results as HTML for the CmsModalSearch React component.
     */
    public function searchResults(HTTPRequest $request): HTTPResponse
    {
        $handler = $this->resolveHandler($request);
        $query = trim((string) $request->getVar('q'));

        if (strlen($query) < $handler->getMinQueryLength()) {
            return $this->htmlResponse(
                '<div style="color: #6c757d; text-align: center; padding: 20px;">'
                . _t(self::class . '.MIN_CHARS', 'Bitte mindestens {n} Zeichen eingeben.', [
                    'n' => $handler->getMinQueryLength(),
                ])
                . '</div>'
            );
        }

        return $this->htmlResponse($handler->search($query, $request));
    }

    /**
     * Returns absolute endpoint URLs for a given handler class.
     *
     * @return array{searchForm: string, searchResults: string}
     */
    public static function endpointsForHandler(string $handlerClass): array
    {
        $controller = static::singleton();
        $qs = '?' . http_build_query(['handler' => $handlerClass]);
        return [
            'searchForm' => Director::absoluteURL($controller->Link('searchForm')) . $qs,
            'searchResults' => Director::absoluteURL($controller->Link('searchResults')) . $qs,
        ];
    }

    private function resolveHandler(HTTPRequest $request): CmsPopupSearchHandler
    {
        $class = $request->getVar('handler');
        if (!$class || !is_subclass_of($class, CmsPopupSearchHandler::class)) {
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
}
