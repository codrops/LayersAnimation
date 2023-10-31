// Importing necessary functions and classes from other files
import { preloadImages } from '../utils.js'; // Utility function for preloading images
import { Item } from '../item.js'; // Item class
import { Content } from '../content.js'; // Content class

// frame element
const frameElement = document.querySelector('.frame');

// Selecting the element with class 'layers'
const DOMlayers = document.querySelector('.layers');
// Selecting all elements with class 'layers__item' and converting NodeList to an array
const DOMItems = [...DOMlayers.querySelectorAll('.layers__item')];
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
    duration: 0.5, // Duration of the animation
    ease: 'power3.inOut', // Type of easing to use for the animation transition
    delayFactor: 0.13  // Delay between each item's animation
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
        'clip-path': 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)', // CSS clip-path shape
    }, { // Animation target state
        ease: 'power3.in',
        stagger: animationSettings.delayFactor, // Time between each item's animation
        'clip-path': 'polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)', // Target shape of the clip-path
    }, 0)
    .to(allItems, { // Animation target state
        ease: 'power3',
        stagger: animationSettings.delayFactor, // Time between each item's animation
        'clip-path': 'polygon(50% 0%, 100% 0%, 100% 43%, 100% 100%, 68% 100%, 32% 100%, 0% 100%, 0% 43%, 0% 0%)', // Target shape of the clip-path
    }, 0.5)
    .to(contentActive.DOM.el, {
        duration: 1,
        startAt: {scale: 1},
        scale: 1.2,
        opacity: 0
    }, 0)
    .add((() => toggleContent()))
    .to(allItems, { // Animation for the last item
        ease: 'power3.in',
        stagger: -1*animationSettings.delayFactor, // Time between each item's animation
        'clip-path': 'polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)', // Animating clip-path to different shape
    }, '<')
    .to(allItems, { // Animation for the last item
        ease: 'power3',
        stagger: -1*animationSettings.delayFactor, // Time between each item's animation
        'clip-path': 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)', // Animating clip-path to different shape
    }, '<+=0.5')
    .fromTo(contentInactive.DOM.el, {
        scale: 1.8,
        opacity: 1
    }, {
        duration: 1,
        ease: 'expo',
        scale: 1
    }, '<+=0.5');

    // Start the animation
    tl.play();

});

// Preloading all images specified by the selector
preloadImages('.layers__item-img').then(() => {
    // Once images are preloaded, remove the 'loading' indicator/class from the body
    document.body.classList.remove('loading');
});
