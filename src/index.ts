import {CommonModule} from "@angular/common";
import {Popover} from "./Popover";
import {PopoverContent} from "./PopoverContent";
import {NgModule} from "@angular/core";

export * from "./Popover";
export * from "./PopoverContent";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        PopoverContent,
        Popover,
    ],
    exports: [
        PopoverContent,
        Popover,
    ],
    entryComponents: [
        PopoverContent
    ]
})
export class PopoverModule {

}