/**
 * Type guard to check if an element is an HTMLElement
 * @param element The element to check
 */
export function isHTMLElement(element: Element): element is HTMLElement {
    return element instanceof HTMLElement;
}

/**
 * Apply styles to an element, handling type checking
 * @param element The element to style
 * @param styles The styles to apply
 */
export function applyStyles(element: Element, styles: Partial<CSSStyleDeclaration>): void {
    if (isHTMLElement(element)) {
        Object.assign(element.style, styles);
    }
}

/**
 * Sets a style property on an element, with type checking
 * @param element The element to style
 * @param property The CSS property name
 * @param value The value to set
 */
export function setStyle(element: Element, property: string, value: string): void {
    if (isHTMLElement(element)) {
        (element.style as any)[property] = value;
    }
}

/**
 * Gets a computed style property from an element
 * @param element The element to get style from
 * @param property The CSS property name
 */
export function getComputedStyle(element: Element, property: string): string {
    if (isHTMLElement(element)) {
        return window.getComputedStyle(element)[property as any] as string;
    }
    return '';
}

/**
 * Safely scrolls an element to a position
 * @param element Element to scroll
 * @param options Scroll options
 */
export function scrollElement(element: Element, options: { top?: number, left?: number }): void {
    if (isHTMLElement(element)) {
        if (options.top !== undefined) {
            element.scrollTop = options.top;
        }
        if (options.left !== undefined) {
            element.scrollLeft = options.left;
        }
    }
}
