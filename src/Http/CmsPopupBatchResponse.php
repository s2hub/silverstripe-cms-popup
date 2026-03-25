<?php

namespace Atwx\CmsPopup\Http;

use SilverStripe\Control\HTTPResponse;

class CmsPopupBatchResponse
{
    public static function success(string $message = '', array $details = []): HTTPResponse
    {
        return self::respond('Success', $message, $details);
    }

    public static function warning(string $message = '', array $details = []): HTTPResponse
    {
        return self::respond('Warning', $message, $details);
    }

    public static function error(string $message, array $details = []): HTTPResponse
    {
        return self::respond('Error', $message, $details, 422);
    }

    private static function respond(string $status, string $message, array $details, int $httpStatus = 200): HTTPResponse
    {
        $response = HTTPResponse::create();
        $response->setStatusCode($httpStatus);
        $response->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode([
            'status'  => $status,
            'message' => $message,
            'details' => $details,
        ]));
        return $response;
    }
}
