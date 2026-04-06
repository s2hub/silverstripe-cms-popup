# silverstripe-cms-popup

Opens modal dialogs in the SilverStripe CMS from a button in the form action menu. Four built-in content types: **Search** (search with result selection), **Batch** (sequential processing of a queue), **Content** (generic HTML loader), and **FormSchema** (full SilverStripe form including HTMLEditorField).

**Requirements:** SilverStripe 6, PHP 8.2+

---

## Installation

```bash
composer require atwx/silverstripe-cms-popup
```

The module registers itself automatically in `LeftAndMain`. No additional YAML configuration required.

---

## Search modal

Opens a dialog with a server-rendered search form. The user enters search terms; results are loaded via AJAX. Clicking a result fires a `cms-modal:select` event on the triggering button.

Create a handler class that extends `CmsPopupSearchHandler`:

```php
use Atwx\CmsPopup\Handler\CmsPopupSearchHandler;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;

class MySearchHandler extends CmsPopupSearchHandler
{
    public function getSearchFormFields(): FieldList
    {
        return FieldList::create(
            TextField::create('q', 'Search')->setAttribute('autofocus', 'autofocus'),
        );
    }

    public function search(string $query, HTTPRequest $request): string
    {
        $results = MyRecord::get()->filter('Title:PartialMatch', $query);
        $html = '';
        foreach ($results as $record) {
            $payload = htmlspecialchars(json_encode(['id' => $record->ID, 'title' => $record->Title]), ENT_QUOTES);
            $html .= "<button type='button' data-cms-select='{$payload}'>{$record->Title}</button>";
        }
        return $html ?: '<p>No results found.</p>';
    }

    // Optional: override minimum query length (default: 2)
    public function getMinQueryLength(): int { return 1; }
}
```

```php
use Atwx\CmsPopup\Forms\CmsModalSearchAction;

$action = CmsModalSearchAction::forHandler(MySearchHandler::class)
    ->setModalTitle('Select a record')
    ->setModalSize('md');
```

The search endpoint is routed automatically via `CmsPopupSearchRouterController` at `cms-search/`.

### autoSearch and initialQuery

- **`autoSearch`** *(bool, default `true`)* — triggers a search immediately when the modal opens
- **`initialQuery`** *(string, optional)* — pre-fills the query and is used for the initial search

```php
$action = CmsModalSearchAction::forHandler(MySearchHandler::class)
    ->setModalTitle('Select a record')
    ->setModalData([
        'autoSearch'   => true,
        'initialQuery' => 'some term',
    ]);
```

### Listening to the select event

```js
document.querySelector('.my-trigger-button').addEventListener('cms-modal:select', (e) => {
    const { id, title } = e.detail;
    // Write the value into a form field, etc.
});
```

---

## Batch modal

Opens a dialog with a configuration form. After clicking "Start", queue items are sent one by one to an action endpoint; progress is displayed live.

```php
use Atwx\CmsPopup\Handler\CmsPopupBatchHandler;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Forms\FieldList;

class MyBatchHandler extends CmsPopupBatchHandler
{
    public function getBatchFormFields(): FieldList
    {
        return FieldList::create(/* your fields */);
    }

    public function getQueueItems(HTTPRequest $request): array
    {
        return [
            ['id' => 1, 'title' => 'Item A'],
            ['id' => 2, 'title' => 'Item B'],
        ];
    }

    public function processItem(HTTPRequest $request): HTTPResponse
    {
        $body = json_decode($request->getBody(), true);
        $record = MyRecord::get()->byID($body['id']);
        if (!$record) {
            return CmsPopupBatchResponse::error('Not found');
        }
        $record->doSomething();
        return CmsPopupBatchResponse::success('Done');
    }
}
```

```php
use Atwx\CmsPopup\Forms\CmsModalBatchAction;

$action = CmsModalBatchAction::forHandler(MyBatchHandler::class, ['pageID' => $this->ID])
    ->setModalTitle('Run batch')
    ->setSubmitLabel('Start');
```

The batch endpoints are routed automatically via `CmsPopupBatchRouterController` at `cms-batch/`.

### Queue endpoint

`getQueueItems()` is called when a field named `recursive` is checked in the batch form. Items are merged with any static queue set via `setBaseQueue()`. Items with `"enabled": false` are skipped.

### Action endpoint

`processItem()` is called via `POST` for each queue item. The request body contains the queue item merged with the form values as JSON:

```json
{ "id": 1, "title": "Item A", "recursive": true }
```

### Response helpers

```php
use Atwx\CmsPopup\Http\CmsPopupBatchResponse;
use Atwx\CmsPopup\Http\CmsPopupBatchDetail;

return CmsPopupBatchResponse::success('Processed', [
    CmsPopupBatchDetail::info('en_US', 'OK'),
]);
return CmsPopupBatchResponse::warning('Skipped', []);
return CmsPopupBatchResponse::error('Failed', [
    CmsPopupBatchDetail::error('de_DE', 'API error'),
]);
```

| Method | HTTP status | Modal display |
|---|---|---|
| `success($message, $details)` | 200 | green check |
| `warning($message, $details)` | 200 | yellow warning |
| `error($message, $details)` | 422 | red cross |

Detail severity: `info` (green), `warning` (yellow), `error` (red).

---

## FormSchema modal

Opens a full SilverStripe form in the modal using `FormBuilderLoader`. Supports all CMS field types including `HTMLEditorField` (TinyMCE). The modal closes automatically after a successful save.

Create a handler class that extends `CmsPopupHandler`:

```php
use Atwx\CmsPopup\Handler\CmsPopupHandler;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\HTMLEditor\HTMLEditorField;
use SilverStripe\ORM\DataObject;

class MyRecordPopup extends CmsPopupHandler
{
    public function getRecord(HTTPRequest $request): DataObject
    {
        return MyRecord::get()->byID((int) $request->getVar('recordID'));
    }

    public function getFields(DataObject $record): FieldList
    {
        return FieldList::create(
            HTMLEditorField::create('Content', 'Content')->setRows(8),
        );
    }

    // Optional overrides:
    // public function save(DataObject $record, array $data, Form $form): void { ... }
    // public function canAccess(DataObject $record): bool { return $record->canEdit(); }
}
```

```php
use Atwx\CmsPopup\Forms\CmsModalFormSchemaAction;

$action = CmsModalFormSchemaAction::forHandler(MyRecordPopup::class, ['recordID' => $this->ID])
    ->setModalTitle('Edit record')
    ->setModalSize('lg');
```

The form endpoint is routed automatically via `CmsPopupAdminController` at `/admin/cms-popup/popup`.

### GridField column

Use `CmsPopupGridFieldColumn` to add a per-row popup button to a GridField:

```php
use Atwx\CmsPopup\GridField\CmsPopupGridFieldColumn;

$config->addComponent(new CmsPopupGridFieldColumn(
    MyRecordPopup::class,
    'recordID',           // query parameter name for the record ID
    'Edit record'         // column tooltip / modal title
));
```

After a successful save, the GridField is automatically reloaded.

---

## Content modal

Loads arbitrary HTML from a URL into the dialog.

```php
use Atwx\CmsPopup\Forms\CmsModalAction;

$action = CmsModalAction::create('showInfo', 'Show details')
    ->setModalComponent('CmsModalContent')
    ->setModalTitle('Information')
    ->setModalData(['url' => $this->Link('infoHtml')]);
```

---

## Button icon

A SilverStripe admin font-icon class can be added to any action button:

```php
$action->setButtonIcon('font-icon-search');
$action->setButtonIcon('font-icon-sync');
```

---

## Modal sizes

| Value | Width |
|---|---|
| `sm` | 480 px |
| `md` | 640 px (default) |
| `lg` | 860 px |

---

## Writing the selected value into a form field

Typical pattern: open search modal → write selected value into a hidden field → save the form.

```php
$hiddenId    = HiddenField::create('MyRecordID');
$hiddenTitle = ReadonlyField::create('MyRecordTitle', 'Selected record');

$search = CmsModalSearchAction::forHandler(MySearchHandler::class)
    ->setModalTitle('Choose record');
```

```js
button.addEventListener('cms-modal:select', (e) => {
    document.querySelector('[name=MyRecordID]').value = e.detail.id;
    document.querySelector('[name=MyRecordTitle]').value = e.detail.title;
});
```

---

## Custom content components

Register a custom React component via the SilverStripe Injector:

```js
import Injector from 'lib/Injector';
import MyCustomModal from './MyCustomModal';

Injector.component.register('MyCustomModal', MyCustomModal);
```

```php
$action->setModalComponent('MyCustomModal');
$action->setModalData(['someParam' => 'value']);
```

The component receives the props `data` (from `setModalData()`), `onClose`, `onSelect`, and `onSaved`.

---

## Building assets

```bash
cd vendor/atwx/silverstripe-cms-popup
npm install
npm run build   # production
npm run dev     # development
npm run watch   # watch mode
```

Output: `client/dist/js/bundle.js` and `client/dist/css/cms-popup.css`.
