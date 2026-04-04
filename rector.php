<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;
use Rector\Set\ValueObject\SetList;

return RectorConfig::configure()
    ->withPaths([
        __DIR__ . '/src',
        __DIR__ . '/tests',
    ])
    ->withSkip([
        // SilverStripe magic properties use mixed arrays – keep them as-is
        __DIR__ . '/src/Admin/CmsPopupAdminController.php' => [
            \Rector\TypeDeclaration\Rector\ClassMethod\ReturnTypeFromReturnNewRector::class,
        ],
    ])
    // Target PHP 8.2 (minimum declared in composer.json)
    ->withPhpSets(php82: true)
    ->withSets([
        SetList::DEAD_CODE,
        SetList::CODE_QUALITY,
        SetList::EARLY_RETURN,
        SetList::TYPE_DECLARATION,
    ]);
