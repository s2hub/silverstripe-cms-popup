<?php

namespace Atwx\CmsPopup\Tests\Unit\Forms;

use Atwx\CmsPopup\Forms\CmsModalAction;
use PHPUnit\Framework\TestCase;

/**
 * Tests for CmsModalAction getters/setters.
 *
 * Note: CmsModalAction extends SilverStripe\Forms\FormAction, so these tests
 * require SilverStripe to be bootstrapped (full composer install including
 * silverstripe/framework). Run via:  vendor/bin/phpunit
 *
 * @group integration
 */
class CmsModalActionTest extends TestCase
{
    private CmsModalAction $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = new CmsModalAction('doSomething', 'Open');
    }

    public function testDefaultModalSizeIsMd(): void
    {
        $this->assertSame('md', $this->action->getModalSize());
    }

    public function testSetModalSizeReturnsFluent(): void
    {
        $result = $this->action->setModalSize('lg');
        $this->assertSame($this->action, $result);
        $this->assertSame('lg', $this->action->getModalSize());
    }

    public function testDefaultModalTitleFallsBackToButtonTitle(): void
    {
        // When no explicit modal title is set, getModalTitle() returns the
        // button label passed to the constructor.
        $this->assertSame('Open', $this->action->getModalTitle());
    }

    public function testSetModalTitleOverridesDefault(): void
    {
        $this->action->setModalTitle('My Popup');
        $this->assertSame('My Popup', $this->action->getModalTitle());
    }

    public function testSetModalComponentReturnsFluent(): void
    {
        $result = $this->action->setModalComponent('MyComponent');
        $this->assertSame($this->action, $result);
        $this->assertSame('MyComponent', $this->action->getModalComponent());
    }

    public function testSetModalDataReturnsFluent(): void
    {
        $data = ['key' => 'value'];
        $result = $this->action->setModalData($data);
        $this->assertSame($this->action, $result);
        $this->assertSame($data, $this->action->getModalData());
    }

    public function testTypeReturnsCmsModalActionString(): void
    {
        $this->assertSame('cms-modal-action action', $this->action->Type());
    }
}
