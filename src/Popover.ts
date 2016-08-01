import { Directive, HostListener, ComponentRef, ViewContainerRef, ComponentResolver, ComponentFactory, Input, OnChanges, SimpleChange } from "@angular/core";
import {PopoverContent} from "./PopoverContent";

@Directive({
    selector: "[popover]"
})
export class Popover implements OnChanges {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private popover: ComponentRef<PopoverContent>;
    private visible: boolean;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private viewContainerRef: ViewContainerRef, private resolver: ComponentResolver) {
    }

    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    @Input("popover")
    content: string|PopoverContent;

    @Input()
    popoverDisabled: boolean;

    @Input()
    popoverAnimation: boolean = true;

    @Input()
    popoverPlacement: "top"|"bottom"|"left"|"right" = "bottom";
    
    @Input()
    popoverTitle: string;

    @Input()
    popoverOnHover: boolean = false;

    @Input()
    popoverCloseOnClickOutside: boolean = false;

    @Input()
    popoverCloseOnMouseOutside: boolean = false;

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    @HostListener("click")
    showOrHideOnClick(): void {
        if (this.popoverOnHover) return;
        if (this.popoverDisabled) return;

        if (!this.visible) {
            this.show();
        } else {
            this.hide();
        }
    }

    @HostListener("focusin")
    @HostListener("mouseenter")
    showOnHover(): void {
        if (!this.popoverOnHover) return;
        if (this.popoverDisabled) return;
        if (this.visible) return;
        
        this.show();
    }

    @HostListener("focusout")
    @HostListener("mouseleave")
    hideOnHover(): void {
        if (this.popoverCloseOnMouseOutside) return; // don't do anything since not we control this
        if (!this.popoverOnHover) return;
        if (this.popoverDisabled) return;
        if (!this.visible) return;

        this.hide();
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        if(changes['popoverDisabled']){
            if(changes['popoverDisabled'].currentValue){
                this.hide();
            }
        }
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private show() {
        this.visible = true;
        if (typeof this.content === "string") {
            this.resolver.resolveComponent(PopoverContent).then((factory: ComponentFactory<any>) => {
                if (!this.visible)
                    return;

                this.popover = this.viewContainerRef.createComponent(factory);
                const popover = this.popover.instance as PopoverContent;
                popover.hostElement = this.viewContainerRef.element.nativeElement;
                popover.content = this.content as string;
                if (this.popoverPlacement !== undefined)
                    popover.placement = this.popoverPlacement;
                if (this.popoverAnimation !== undefined)
                    popover.animation = this.popoverAnimation;
                if (this.popoverTitle !== undefined)
                    popover.title = this.popoverTitle;
                if (this.popoverCloseOnClickOutside !== undefined)
                    popover.closeOnClickOutside = this.popoverCloseOnClickOutside;
                if (this.popoverCloseOnMouseOutside !== undefined)
                    popover.closeOnMouseOutside = this.popoverCloseOnMouseOutside;
                
                popover.onCloseFromOutside.subscribe(() => this.hide());
            });
        } else {
            const popover = this.content as PopoverContent;
            popover.hostElement = this.viewContainerRef.element.nativeElement;
            if (this.popoverPlacement !== undefined)
                popover.placement = this.popoverPlacement;
            if (this.popoverAnimation !== undefined)
                popover.animation = this.popoverAnimation;
            if (this.popoverTitle !== undefined)
                popover.title = this.popoverTitle;
            if (this.popoverCloseOnClickOutside !== undefined)
                popover.closeOnClickOutside = this.popoverCloseOnClickOutside;
            if (this.popoverCloseOnMouseOutside !== undefined)
                popover.closeOnMouseOutside = this.popoverCloseOnMouseOutside;

            popover.onCloseFromOutside.subscribe(() => this.hide());
            popover.show();
        }
    }

    private hide() {
        this.visible = false;
        if (this.popover)
            this.popover.destroy();

        if (this.content instanceof PopoverContent)
            (this.content as PopoverContent).hide();
    }

}