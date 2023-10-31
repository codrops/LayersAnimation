
export class Item {
    // Class property initialization with default values.
    // The DOM property holds references to the main and inner elements of the Item component.
    DOM = {
        el: null,   // Holds the reference to the main DOM element with class 'layers__item'.
        inner: null, // Holds the reference to the inner DOM element with class 'layers__item-img'.
    };

    /**
     * Constructor for the Item class. Initializes the instance, sets up DOM references, and binds events.
     * @param {HTMLElement} DOM_el - The main DOM element for the Item, expected to have a child with class 'layers__item-img'.
     */
    constructor(DOM_el) {
        // Assign the provided DOM element to the 'el' property of the 'DOM' object.
        this.DOM.el = DOM_el;
        this.DOM.inner = this.DOM.el.querySelector('.layers__item-img');
    }
}