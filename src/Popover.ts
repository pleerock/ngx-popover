import { Directive, HostListener, ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, Input, OnChanges, SimpleChange, Output, EventEmitter } from "@angular/core";
import {PopoverContent} from "./PopoverContent";

@Directive({
    selector: "[popover]",
    exportAs: "popover"
})
export class Popover implements OnChanges {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    protected PopoverComponent = PopoverContent;
    protected popover: ComponentRef<PopoverContent>;
    protected visible: boolean;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(protected viewContainerRef: ViewContainerRef,
                protected resolver: ComponentFactoryResolver) {
    }

    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    @Input("popover")
    content: string|PopoverContent;

    @Input()
    popoverDisabled: boolean;

    @Input()
    popoverAnimation: boolean;

    @Input()
    popoverPlacement: "top"|"bottom"|"left"|"right"|"auto"|"auto top"|"auto bottom"|"auto left"|"auto right";

    @Input()
    popoverTitle: string;

    @Input()
    popoverOnHover: boolean = false;

    @Input()
    popoverCloseOnClickOutside: boolean;

    @Input()
    popoverCloseOnMouseOutside: boolean;

    @Input()
    popoverDismissTimeout: number = 0;

    @Output()
    onShown = new EventEmitter<Popover>();

    @Output()
    onHidden = new EventEmitter<Popover>();

    // -------------------------------------------------------------------------
    // Event listeners
    // -------------------------------------------------------------------------

    @HostListener("click")
    showOrHideOnClick(): void {
        if (this.popoverOnHover) return;
        if (this.popoverDisabled) return;
        this.toggle();
    }

    @HostListener("focusin")
    @HostListener("mouseenter")
    showOnHover(): void {
        if (!this.popoverOnHover) return;
        if (this.popoverDisabled) return;
        this.show();
    }

    @HostListener("focusout")
    @HostListener("mouseleave")
    hideOnHover(): void {
        if (this.popoverCloseOnMouseOutside) return; // don't do anything since not we control this
        if (!this.popoverOnHover) return;
        if (this.popoverDisabled) return;
        this.hide();
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        if (changes["popoverDisabled"]) {
            if (changes["popoverDisabled"].currentValue) {
                this.hide();
            }
        }
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    toggle() {
        if (!this.visible) {
            this.show();
        } else {
            this.hide();
        }
    }

    show() {
        if (this.visible) return;

        this.visible = true;
        if (typeof this.content === "string") {
            const factory = this.resolver.resolveComponentFactory(this.PopoverComponent);
            if (!this.visible)
                return;

            this.popover = this.viewContainerRef.createComponent(factory);
            const popover = this.popover.instance as PopoverContent;
            popover.popover = this;
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
            // if dismissTimeout option is set, then this popover will be dismissed in dismissTimeout time
            if (this.popoverDismissTimeout > 0)
                setTimeout(() => this.hide(), this.popoverDismissTimeout);
        } else {
            const popover = this.content as PopoverContent;
            popover.popover = this;
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
            // if dismissTimeout option is set, then this popover will be dismissed in dismissTimeout time
            if (this.popoverDismissTimeout > 0)
                setTimeout(() => this.hide(), this.popoverDismissTimeout);
            popover.show();
        }

        this.onShown.emit(this);
    }

    hide() {
        if (!this.visible) return;

        this.visible = false;
        if (this.popover)
            this.popover.destroy();

        if (this.content instanceof PopoverContent)
            (this.content as PopoverContent).hideFromPopover();

        this.onHidden.emit(this);
    }

    getElement() {
        return this.viewContainerRef.element.nativeElement;
    }

}
