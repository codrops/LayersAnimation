// Importing necessary functions and classes from other files
import { preloadImages } from '../utils.js'; // Utility function for preloading images
import { Item } from '../item.js'; // Item class
import { Content } from '../content.js'; // Content class

// frame element
const frameElement = document.querySelector('.frame');

// Selecting all elements with class 'layers__item' and converting NodeList to an array
const DOMItems = [...document.querySelectorAll('.layers__item')];
const items = []; // Array to store instances of the Item class

// Creating new instances of Item for each selected DOM element
DOMItems.forEach(item => {
    items.push(new Item(item)); // Initializing a new object for each item
});

// Selecting all elements with class 'content__inner' and converting NodeList to an array
const DOMContentSections = [...document.querySelectorAll('.content > .content__inner')];
const contents = []; // Array to store instances of the Content class

// Creating new instances of Content for each selected DOM element
DOMContentSections.forEach(content => {
    contents.push(new Content(content)); // Initializing a new object for each content
});

// Toggle the "hidden" class between two content elements
const toggleContent = () => {
    // Assuming there are only two content elements
    const [content1, content2] = contents;

    // Toggle the 'hidden' class on the first content element
    if (content1.DOM.el.classList.contains('hidden')) {
        content1.DOM.el.classList.remove('hidden');
        content2.DOM.el.classList.add('hidden');
    } else {
        content1.DOM.el.classList.add('hidden');
        content2.DOM.el.classList.remove('hidden');
    }
};

// GSAP timeline
let tl = null;

// Setting up the animation properties
const animationSettings = {
    duration: 1.4, // Duration of the animation
    ease: 'power3.inOut', // Type of easing to use for the animation transition
    delayFactor: 0.2  // Delay between each item's animation
};

// Event listener for click events on the document
document.addEventListener('click', event => {
    // Check if the timeline is currently active (running)
    if (tl && tl.isActive() || frameElement.contains(event.target)) {
        return false; // Don't start a new animation
    }

    // The currently active content element
    const contentActive = contents.find(content => !content.DOM.el.classList.contains('hidden'));
    
    // Assuming there are only two content elements
    const contentInactive = contents.find(content => content !== contentActive);

    // Mapping each Item object to its actual DOM element for the animation
    const allItems = items.map(item => item.DOM.el);

    // Isolating the last item's DOM element for a separate animation effect
    const lastItem = items[items.length - 1].DOM.el;

    // Mapping each Item object to its 'inner' property (inner image)
    const allInnerItems = items.map(item => item.DOM.inner);
    
    // Creating a new GSAP timeline for managing a sequence of animations
    tl = gsap.timeline({
        paused: true, // Create the timeline in a paused state
        defaults: { // Default settings applied to all animations within this timeline
            duration: animationSettings.duration,
            ease: animationSettings.ease,
        }
    })
    .fromTo(allItems, { // Initial animation state
        opacity: 1, // Fully visible
        'clip-path': 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' // CSS clip-path shape
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
        'clip-path': 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Target shape of the clip-path
    }, 0)
    .fromTo(allInnerItems, { // Starting state for 'inner' elements' animation
        yPercent: 0,
        filter: 'brightness(30%)' // CSS filters to adjust color
    }, { // Animation target state
        stagger: animationSettings.delayFactor, // Stagger settings similar to above
        filter: 'brightness(100%)' // Full brightness
    }, 0)
    .to([contentActive.DOM.title, contentActive.DOM.description], {
        startAt: {yPercent: 0},
        stagger: -0.04,
        yPercent: -200
    }, 0)
    .add((() => toggleContent()))
    .fromTo([contentInactive.DOM.title, contentInactive.DOM.description], {
        yPercent: 200
    }, {
        ease: 'expo', // Different easing effect
        stagger: -0.15,
        yPercent: 0
    })
    .to(lastItem, { // Animation for the last item
        duration: 1,
        ease: 'power4', // Different easing effect
        'clip-path': 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', // Animating clip-path to different shape
        onComplete: () => gsap.set(lastItem, {opacity: 0}) // After animation, hide the last item
    }, '<');

    // Start the animation
    tl.play();

});

// Preloading all images specified by the selector
preloadImages('.layers__item-img').then(() => {
    // Once images are preloaded, remove the 'loading' indicator/class from the body
    document.body.classList.remove('loading');
});
