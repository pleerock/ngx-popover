import {Directive, HostListener, ComponentRef, ViewContainerRef, ComponentResolver, ComponentFactory, Input} from "@angular/core";
import {PopoverContent} from "./PopoverContent";

@Directive({
    selector: "[popover]"
})
export class Popover {

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
    popoverCloseOnClickOutside: boolean = false;

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    @HostListener("click")
    showOrHide(): void {
        if (this.popoverDisabled)
            return;

        if (!this.visible) {
            this.show();
        } else {
            this.hide();
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
                this.popover.instance.hostElement = this.viewContainerRef.element.nativeElement;
                this.popover.instance.content = this.content as string;
                if (this.popoverPlacement !== undefined)
                    this.popover.instance.placement = this.popoverPlacement;
                if (this.popoverAnimation !== undefined)
                    this.popover.instance.animation = this.popoverAnimation;
                if (this.popoverTitle !== undefined)
                    this.popover.instance.title = this.popoverTitle;
                if (this.popoverCloseOnClickOutside !== undefined)
                    this.popover.instance.closeOnClickOutside = this.popoverCloseOnClickOutside;
                this.popover.instance.onCloseFromOutside.subscribe(() => this.hide());
            });
        } else {
            const tooltip = this.content as PopoverContent;
            tooltip.hostElement = this.viewContainerRef.element.nativeElement;
            if (this.popoverPlacement !== undefined)
                tooltip.placement = this.popoverPlacement;
            if (this.popoverAnimation !== undefined)
                tooltip.animation = this.popoverAnimation;
            if (this.popoverTitle !== undefined)
                tooltip.title = this.popoverTitle;
            if (this.popoverCloseOnClickOutside !== undefined)
                tooltip.closeOnClickOutside = this.popoverCloseOnClickOutside;

            tooltip.onCloseFromOutside.subscribe(() => this.hide());
            tooltip.show();
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