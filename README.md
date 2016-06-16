# ng2-popover

Simple popover control for your angular2 applications using bootstrap3. Does not depend of jquery.
If you want to use it without bootstrap - simply create proper css classes.

![angular 2 popover](https://raw.githubusercontent.com/pleerock/ng2-popover/master/resources/popover-example.png)

## Installation

1. Install npm module:

`npm install ng2-popover --save`

2. If you are using system.js you may want to add this into `map` and `package` config:

```json
{
    "map": {
        "ng2-popover": "node_modules/ng2-popover"
    },
    "packages": {
        "ng2-popover": { "main": "index.js", "defaultExtension": "js" }
    }
}
```

## Usage

Example of simple usage:

```html
<div popover="content to be shown in the popover"
     popoverTitle="Popover header"
     popoverPlacement="top"
     [popoverCloseOnClickOutside]="true"
     [popoverDisabled]="false"
     [popoverAnimation]="true">
    element on which this popover is applied.
</div>
```

Example of usage with dynamic html content:

```html
<popover-content #myPopover 
                title="Popover title" 
                placement="left"
                [animation]="true" 
                [closeOnClickOutside]="true" >
    <b>Very</b> <span style="color: #C21F39">Dynamic</span> <span style="color: #00b3ee">Reusable</span>
    <b><i><span style="color: #ffc520">Popover With</span></i></b> <small>Html support</small>.
</popover-content>

<button [popover]="myPopover">element on which this popover is applied.</button>
```

* `<div popover>`:
    * `popover="string"` The message to be shown in the popover.
    * `popoverTitle="string"` Popover title text.
    * `popoverPlacement="top|bottom|left|right"` Indicates where the popover should be placed. Default is **"bottom"**.
    * `[popoverCloseOnClickOutside]="true|false"` Indicates if popover should be closed when you click outside of it. Default is **false**.
    * `[popoverDisabled]="true|false"` Indicates if popover should be disabled. If popover is disabled then it will not be shown. Default is **false**
    * `[popoverAnimation]="true|false"` Indicates if all popover should be shown with animation or not. Default is **true**.
* `<popover-content>`:
    * `placement="top|bottom|left|right"` Indicates where the popover should be placed. Default is **"bottom"**.
    * `[animation]="true|false"` Indicates if all popover should be shown with animation or not. Default is **true**.
    * `[closeOnClickOutside]="true|false"` Indicates if popover should be closed when you click outside of it. Default is **false**.

## Sample

```typescript
import {Component} from "@angular/core";
import {POPOVER_DIRECTIVES} from "ng2-popover";

@Component({
    selector: "app",
    template: `
<div class="container">

    <!-- regular popover -->
    <p>
        It is a long established <span popover="Hello fact!" popoverTitle="Fact #1"><b>click this fact</b></span> that a reader will be distracted by the readable content of a page when looking at its layout.
        The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
        <span popover="many, but not all" popoverPlacement="left"><b>Many desktop</b></span> publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.
        <span popover="various, but not all" popoverPlacement="right"><b>Various versions</b></span> have evolved over the years, sometimes by accident, <span popover="another hint" popoverPlacement="top"><b>sometimes on purpose</b></span> (injected humour and the like)
    </p>

    <br/>
    <button popover="Hello popover. Now click outside." [popoverCloseOnClickOutside]="true">
        click to open popover that will be closed when you click outside of it.
    </button>

    <!-- popover with dynamic html content -->
    <br/><br/>
    <div>
        <popover-content #myPopover
            title="this header can be omitted"
            [closeOnClickOutside]="true">
            <b>Very</b> <span style="color: #C21F39">Dynamic</span> <span style="color: #00b3ee">Reusable</span>
            <b><i><span style="color: #ffc520">Popover With</span></i></b> <small>Html support</small>.
            Click outside of this popover and it will be dismissed automatically.
        </popover-content>

        <button [popover]="myPopover">click this button to see a popover</button>
    </div>

</div>
`,
    directives: [POPOVER_DIRECTIVES]
})
export class App {

}
```

Take a look on samples in [./sample](https://github.com/pleerock/ng2-popover/tree/master/sample) for more examples of
usages.
