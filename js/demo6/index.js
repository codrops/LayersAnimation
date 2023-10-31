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
    duration: 0.9, // Duration of the animation
    ease: 'power2.inOut', // Type of easing to use for the animation transition
    delayFactor: 0.08 // Delay between each item's animation
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
    .fromTo(DOMlayers, {
        scale: 0.8
    }, {
        duration: animationSettings.duration + animationSettings.delayFactor*items.length,
        scale: 1
    }, 0)
    .fromTo(allItems, { // Initial animation state
        opacity: 1, // Fully visible
        'clip-path': 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' // CSS clip-path shape
    }, { // Animation target state
        stagger: animationSettings.delayFactor,
        'clip-path': 'polygon(25% 0%, 75% 0%, 75% 100%, 25% 100%)', // Target shape of the clip-path
    }, 0)
    .to(contentActive.DOM.el, {
        startAt: {scale: 1, opacity: 1},
        stagger: -0.04,
        scale: 1.2,
        opacity: 0
    }, 0)
    .add((() => toggleContent()))
    .to(allItems, { // Animation target state
        ease: 'power3',
        stagger: animationSettings.delayFactor,
        'clip-path': 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Target shape of the clip-path
    }, '>')
    .to(allItems, { // Animation target state
        stagger: -1*animationSettings.delayFactor*.7,
        'clip-path': 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)', // Target shape of the clip-path
    }, '>-=0.2')
    .fromTo(contentInactive.DOM.el, {
        scale: 1.8,
        opacity: 0
    }, {
        duration: 1.2,
        ease: 'elastic.out(.4)', // Different easing effect
        scale: 1,
        opacity: 1,
    }, `>-=${.6*animationSettings.duration}`)

    // Start the animation
    tl.play();
});

// Preloading all images specified by the selector
preloadImages('.layers__item-img').then(() => {
    // Once images are preloaded, remove the 'loading' indicator/class from the body
    document.body.classList.remove('loading');
});
