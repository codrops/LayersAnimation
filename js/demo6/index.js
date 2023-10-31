// Importing necessary functions and classes from other files
import { preloadImages } from '../utils.js'; // Utility function for preloading images
import { Item } from '../item.js'; // Item class

// Selecting all elements with class 'layers__item' and converting NodeList to an array
const DOMItems = [...document.querySelectorAll('.layers__item')];
const items = []; // Array to store instances of the Item class

// Creating new instances of Item for each selected DOM element
DOMItems.forEach(item => {
    items.push(new Item(item)); // Initializing a new object for each item
});

// Setting up the animation properties
const animationSettings = {
    duration: 1.4, // Duration of the animation
    ease: 'power3.inOut', // Type of easing to use for the animation transition
    delayFactor: 0.15  // Delay between each item's animation
};

// Event listener for click events on the document
document.addEventListener('click', () => {
    // Mapping each Item object to its actual DOM element for the animation
    const allItems = items.map(item => item.DOM.el);

    // Isolating the last item's DOM element for a separate animation effect
    const lastItem = items[items.length - 1].DOM.el;

    // Mapping each Item object to its 'inner' property (inner image)
    const allInnerItems = items.map(item => item.DOM.inner);

    const lastInner = items[items.length - 1].DOM.inner;
    
    // Creating a new GSAP timeline for managing a sequence of animations
    const tl = gsap.timeline({
        defaults: { // Default settings applied to all animations within this timeline
            duration: animationSettings.duration,
            ease: animationSettings.ease,
        }
    })
    .fromTo(allItems, { // Initial animation state
        opacity: 1, // Fully visible
        'clip-path': 'circle(150% at 50% 330%)' // CSS clip-path shape
    }, { // Animation target state
        stagger: { // Settings for staggering animations for each item
            each: animationSettings.delayFactor, // Time between each item's animation
            onComplete: function() { // Callback after each item finishes animating
                const targetElement = this.targets()[0]; // The element that just finished animating
                // Determining the index of the animated element within the original DOM NodeList
                const index = DOMItems.indexOf(targetElement);
                if ( index ) { // If the element is not the first one (index 0)
                    // Set the opacity of the previous element to 0
                    gsap.set(items[index-1].DOM.el, {opacity: 0});
                }
            },
        },
        'clip-path': 'circle(150% at 50% 80%)', // Target shape of the clip-path
    }, 0)
    
    .fromTo(allInnerItems, { // Starting state for 'inner' elements' animation
        yPercent: 0,
        filter: 'brightness(30%)' // CSS filters to adjust color
    }, { // Animation target state
        stagger: animationSettings.delayFactor, // Stagger settings similar to above
        filter: 'brightness(100%)' // Full brightness
    }, 0) 
    
    .to(lastItem, { // Animation for the last item
        duration: 1,
        ease: 'power4', // Different easing effect
        'clip-path': 'circle(100% at 50% -160%)', // Animating clip-path to different shape
        onComplete: () => gsap.set(lastItem, {opacity: 0}) // After animation, hide the last item
    })

    .to(lastInner, {
        duration: 1,
        ease: 'power1', // Different easing effect
        yPercent: -20,
        filter: 'brightness(50%)',
    }, '<');

});

// Preloading all images specified by the selector
preloadImages('.layers__item-img').then(() => {
    // Once images are preloaded, remove the 'loading' indicator/class from the body
    document.body.classList.remove('loading');
});
