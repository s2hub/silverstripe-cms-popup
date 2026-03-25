<?php

namespace Atwx\CmsPopup\Http;

class CmsPopupBatchDetail
{
    public static function info(string $label, string $status = ''): array
    {
        return ['label' => $label, 'status' => $status, 'level' => 'info'];
    }

    public static function warning(string $label, string $status = ''): array
    {
        return ['label' => $label, 'status' => $status, 'level' => 'warning'];
    }

    public static function error(string $label, string $status = ''): array
    {
        return ['label' => $label, 'status' => $status, 'level' => 'error'];
    }
}
