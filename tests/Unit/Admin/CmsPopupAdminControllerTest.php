<?php

namespace Atwx\CmsPopup\Tests\Unit\Admin;

use Atwx\CmsPopup\Admin\CmsPopupAdminController;
use PHPUnit\Framework\TestCase;

/**
 * Tests for the pure static helper methods on CmsPopupAdminController.
 * These methods have no SilverStripe dependencies and run without a full stack.
 */
class CmsPopupAdminControllerTest extends TestCase
{
    // -------------------------------------------------------------------------
    // buildIdentifier
    // -------------------------------------------------------------------------

    public function testBuildIdentifierWithNoParams(): void
    {
        $id = CmsPopupAdminController::buildIdentifier(
            CmsPopupAdminController::class,
            ['handler' => CmsPopupAdminController::class]
        );

        $this->assertSame('CmsPopupAdminController', $id);
    }

    public function testBuildIdentifierIncludesParamValues(): void
    {
        $id = CmsPopupAdminController::buildIdentifier(
            CmsPopupAdminController::class,
            ['handler' => CmsPopupAdminController::class, 'pageID' => 42]
        );

        $this->assertSame('CmsPopupAdminController_42', $id);
    }

    public function testBuildIdentifierSortsParamsAlphabetically(): void
    {
        $unordered = CmsPopupAdminController::buildIdentifier(
            CmsPopupAdminController::class,
            ['handler' => CmsPopupAdminController::class, 'z' => 'last', 'a' => 'first']
        );

        $ordered = CmsPopupAdminController::buildIdentifier(
            CmsPopupAdminController::class,
            ['handler' => CmsPopupAdminController::class, 'a' => 'first', 'z' => 'last']
        );

        $this->assertSame($unordered, $ordered);
        $this->assertSame('CmsPopupAdminController_first_last', $unordered);
    }

    public function testBuildIdentifierStripsHandlerKey(): void
    {
        $id = CmsPopupAdminController::buildIdentifier(
            CmsPopupAdminController::class,
            ['handler' => 'SomeHandler', 'id' => 7]
        );

        // 'handler' must not appear in the suffix
        $this->assertStringNotContainsString('SomeHandler', $id);
        $this->assertSame('CmsPopupAdminController_7', $id);
    }

    public function testBuildIdentifierUsesShortClassName(): void
    {
        $id = CmsPopupAdminController::buildIdentifier(
            CmsPopupAdminController::class,
            []
        );

        // Only the short name, not the FQCN
        $this->assertStringNotContainsString('\\', $id);
        $this->assertSame('CmsPopupAdminController', $id);
    }
}
