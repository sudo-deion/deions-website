// Select all letter elements
const letters = document.querySelectorAll(
    '.svg_letter_wrap > path'); // Select all direct child path elements
    
    if (letters.length > 0) {
      console.log('GSAP animation script running');
      console.log('Letters found:', letters);
    
      // Animate the letters with staggered effects
      gsap.from(letters, {
        duration: 1.5,
        y: 100, // Start from 100px below
        stagger: 0.1, // Stagger the animation by 0.1 seconds
        ease: CustomEase.create("custom",
        "M0,0 C0,0.712 0.104,1 1,1 "), // Easing function for the animation
      });
    } else {
      console.log('No letters found');
    }
    
    // Register the ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Create a timeline for the animations for section_hero
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".section_hero",
        start: "top top", // Start when the top of section_hero hits the top of the viewport
        end: "bottom top", // End when the bottom of section_hero hits the top of the viewport
        scrub: true, // Smooth scrubbing
        pin: true // Pin the section_hero during the scroll
      }
    });
    
    // Select the reel_wrap element and its parent
    const reelWrap = document.querySelector('.reel_wrap');
    
    if (reelWrap) {
      const parent = reelWrap.parentElement; // Get the parent element
    
      // Scale the reel_wrap in the Y direction on page load with a delay
      gsap.from(reelWrap, {
        duration: 1, // Duration of the scaling animation
        scaleY: 0,
        scaleX: 0,
        transformOrigin: "top", // Set the origin for scaling
        ease: "back.out(1.7)", // Easing function for the scaling
        delay: 0.8, // Delay before the scaling animation starts
      });
    
      // Add an event listener for mouse movement
      document.addEventListener('mousemove', (event) => {
        const mouseX = event.clientX;
    
        // Get the width of the reel_wrap element and the parent element
        const wrapWidth = reelWrap.offsetWidth;
        const parentWidth = parent.offsetWidth;
    
        // Calculate the new position, ensuring it stays within the parent's bounds
        const newX = Math.min(parentWidth - wrapWidth, Math.max(0, mouseX - wrapWidth / 2));
    
        // Use GSAP to animate the reel_wrap element's position
        gsap.to(reelWrap, {
          duration: 1, // Duration of the animation
          x: newX, // Move to the new X position
          ease: "power2.out", // Easing function for the animation
        });
      });
    } else {
      console.log('reel_wrap not found');
    }
    