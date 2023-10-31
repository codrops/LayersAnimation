
export class Content {
    // Class property initialization with default values.
    // The DOM property holds references to the main and inner elements of the Content component.
    DOM = {
        el: null,   // Holds the reference to the main DOM element with class 'content__inner'.
        title: null, // Holds the reference to the inner DOM element <h2>.
        description: null, // Holds the reference to the inner DOM element <p>.
    };

    /**
     * Constructor for the Content class. Initializes the instance, sets up DOM references, and binds events.
     * @param {HTMLElement} DOM_el - The main DOM element for the Content
     */
    constructor(DOM_el) {
        // Assign the provided DOM element to the 'el' property of the 'DOM' object.
        this.DOM.el = DOM_el;
        this.DOM.title = this.DOM.el.querySelector('h2');
        this.DOM.description = this.DOM.el.querySelector('p');
    }
}