import { data } from "./data.js";
import { initLettersSlideUpTrue } from "./global.js"; // Import the function

// -----Letters Animation-in on load----- /

const letters = document.querySelectorAll(".svg_letter_wrap > path"); // Select all direct child path elements

if (letters.length > 0) {
  // Animate the letters with staggered effects
  gsap.from(letters, {
    delay: 0.8,
    duration: 1.5,
    y: 700, // Start from 100px below
    stagger: 0.1, // Stagger the animation by 0.1 seconds
    ease: CustomEase.create("custom", "M0,0 C0,0.712 0.104,1 1,1 "), // Easing function for the animation
  });
}

// -----Hero section pinned----- /

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section_hero",
    start: "top top", // Start when the top of section_hero hits the top of the viewport
    end: "bottom top", // End when the bottom of section_hero hits the top of the viewport
    scrub: true, // Smooth scrubbing
    pin: true, // Pin the section_hero during the scroll
  },
});

// -----Reel animating in and Mouse movement----- /

const reelWrap = document.querySelector(".reel_wrap");

if (reelWrap) {
  const parent = reelWrap.parentElement; // Get the parent element

  // Scale the reel_wrap in the Y direction on page load with a delay
  gsap.from(reelWrap, {
    duration: 1, // Duration of the scaling animation
    scaleY: 0,
    scaleX: 0,
    transformOrigin: "top", // Set the origin for scaling
    ease: "back.out(1.7)", // Easing function for the scaling
    delay: 1.5, // Delay before the scaling animation starts
  });

  // Add an event listener for mouse movement
  document.addEventListener("mousemove", (event) => {
    const mouseX = event.clientX;

    // Get the width of the reel_wrap element and the parent element
    const wrapWidth = reelWrap.offsetWidth;
    const parentWidth = parent.offsetWidth;

    // Calculate the new position, ensuring it stays within the parent's bounds
    const newX = Math.min(
      parentWidth - wrapWidth,
      Math.max(0, mouseX - wrapWidth / 2),
    );

    // Calculate the tilt based on mouse position
    const tilt = ((mouseX - parentWidth / 2) / parentWidth) * 20; // Adjust the tilt based on mouse position

    // Use GSAP to animate the reel_wrap element's position and tilt
    gsap.to(reelWrap, {
      duration: 1, // Duration of the animation
      x: newX, // Move to the new X position
      ease: "power2.out", // Easing function for the animation
    });
  });
}

// -----Project Section----- /

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const pinnedSection = document.querySelector(".section_project_sticky");
const progressBar = document.querySelector(".progress");
const pinnedHeight = window.innerHeight * 10;
const images = gsap.utils.toArray(".project_media");
const mediaElements = gsap.utils.toArray(".h_project_media");

function animateImageEntry(img) {
  if (!img) return;

  // Animate the anchor wrapper
  gsap.fromTo(
    img,
    {
      scale: 1.25,
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      opacity: 0,
    },
    {
      scale: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      opacity: 1,
      duration: 1,
      ease: "expo.out",
    },
  );

  // Animate the video element
  const mediaElement = img.querySelector(".h_project_media");
  if (mediaElement) {
    gsap.fromTo(
      mediaElement,
      {
        scale: 2,
        filter: "contrast(2) brightness(10)",
      },
      {
        scale: 1,
        filter: "contrast(1) brightness(1)",
        duration: 1,
        ease: "expo.out",
      },
    );
  }
}

function animateImageExitForward(img) {
  gsap.to(img, {
    scale: 0.5,
    opacity: 0,
    duration: 1,
    ease: "expo.out",
  });
}

function animateImageExitReverse(img) {
  gsap.to(img, {
    scale: 1.25,
    clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    duration: 1,
    ease: "expo.out",
  });

  const mediaElement = img.querySelector(".h_project_media");
  if (mediaElement) {
    gsap.to(mediaElement, {
      scale: 2,
      duration: 1.5,
      ease: "expo.out",
    });
  }
}

function updateInfoContent(index) {
  // Update selectors to match new class names
  const titleText = document.querySelector(".h_project_title_text");
  const taglineText = document.querySelector(".h_project_tagline_text");
  const tagText = document.querySelector(".h_project_tag_text");
  const yearText = document.querySelector(".h_project_year_text");
  const link = document.querySelector(".h_project_link");
  const linkText = document.querySelector(".h_project_link_text");

  // Clear existing content
  [titleText, taglineText, tagText, yearText, linkText].forEach((element) => {
    if (element) element.innerHTML = "";
  });

  const item = data[index];

  // Update both the explore link and the media links
  if (link) {
    link.setAttribute("href", item.link);
  }

  // Update all media links to be clickable
  const mediaLinks = document.querySelectorAll(".project_media");
  mediaLinks.forEach((mediaLink) => {
    mediaLink.style.cursor = "pointer";
    mediaLink.style.pointerEvents = "auto";
    mediaLink.style.zIndex = "1";
    mediaLink.setAttribute("href", item.link);
  });

  const contentArray = [
    { element: titleText, content: item.title },
    { element: taglineText, content: item.tagline },
    { element: tagText, content: item.tag },
    { element: yearText, content: item.year },
  ];

  // Animate each text element
  contentArray.forEach(({ element, content }) => {
    if (!element) return;

    const letters = content.split("");
    letters.forEach((letter, index) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.opacity = 0;
      element.appendChild(span);

      gsap.to(span, {
        opacity: 1,
        duration: 0.01,
        delay: 0.03 * index,
        ease: "expo.out",
      });
    });
  });

  // Update and animate link
  if (link && linkText) {
    link.setAttribute("href", item.link);
    const letters = "Explore".split("");
    letters.forEach((letter, index) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.opacity = 0;
      linkText.appendChild(span);

      gsap.to(span, {
        opacity: 1,
        duration: 0.01,
        delay: 0.03 * index,
        ease: "expo.out",
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Make media links clickable
  const mediaLinks = document.querySelectorAll(".project_media");
  mediaLinks.forEach((mediaLink) => {
    mediaLink.style.cursor = "pointer";
    mediaLink.style.pointerEvents = "auto";
    mediaLink.style.zIndex = "1";
  });

  // Ensure project info stays on top
  const projectInfo = document.querySelector(".project_sticky_info");
  if (projectInfo) {
    projectInfo.style.zIndex = "2";
    projectInfo.style.pointerEvents = "none"; // Allow clicks to pass through to media
  }

  // Make only the link clickable within the info section
  const projectLink = document.querySelector(".h_project_link");
  if (projectLink) {
    projectLink.style.pointerEvents = "auto";
    projectLink.style.position = "relative";
    projectLink.style.zIndex = "3";
  }

  // Make only the text elements block pointer events
  const textElements = document.querySelectorAll(
    ".h_project_title_text, .h_project_tagline_text, .h_project_tag_text, .h_project_year_text",
  );
  textElements.forEach((element) => {
    element.style.position = "relative";
    element.style.pointerEvents = "auto";
    element.style.zIndex = "2";
  });

  updateInfoContent(0);
  animateImageEntry(images[0]);
});

let lastCycle = 0;

ScrollTrigger.create({
  trigger: pinnedSection,
  start: "top top",
  end: `+=${pinnedHeight * 0.3}`,
  pin: true,
  pinSpacing: true,
  scrub: 0.1,
  onUpdate: (self) => {
    const totalProgress = self.progress * 4;
    const currentCycle = Math.floor(totalProgress);
    const cycleProgress = (totalProgress % 1) * 100;

    if (currentCycle < images.length) {
      const currentImage = images[currentCycle];

      if (currentImage) {
        const scale = 1 - (0.25 * cycleProgress) / 100;
        gsap.to(currentImage, {
          scale: scale,
          duration: 0.1,
          overwrite: "auto",
        });
      }

      if (currentCycle !== lastCycle) {
        if (self.direction > 0) {
          if (lastCycle < images.length)
            animateImageExitForward(images[lastCycle]);
          if (currentCycle < images.length) {
            animateImageEntry(images[currentCycle]);
            gsap.delayedCall(0.5, () => updateInfoContent(currentCycle));
          }
        } else {
          if (currentCycle < images.length) {
            animateImageEntry(images[currentCycle]);
            gsap.delayedCall(0.5, () => updateInfoContent(currentCycle));
          }
          if (lastCycle < images.length)
            animateImageExitReverse(images[lastCycle]);
        }
        lastCycle = currentCycle;
      }
    }

    if (currentCycle < 5) {
      gsap.to(progressBar, {
        height: `${cycleProgress}%`,
        duration: 0.1,
        overwrite: true,
      });

      if (cycleProgress < 1 && self.direction > 0) {
        gsap.set(progressBar, { height: "0%" });
      } else if (cycleProgress > 99 && self.direction < 0) {
        gsap.set(progressBar, { height: "100%" });
      }
    } else {
      gsap.to(progressBar, {
        height: self.direction > 0 ? "100%" : `${cycleProgress}%`,
        duration: 0.1,
        overwrite: true,
      });
    }
  },
});

gsap.to(".project_sticky_info", {
  opacity: 1,
  duration: 1,
});

// -----Skills Section----- //

function initImageTrail(config = {}) {

  // config + defaults
  const options = {
    minWidth: config.minWidth ?? 992,
    moveDistance: config.moveDistance ?? 15,
    stopDuration: config.stopDuration ?? 300,
    trailLength: config.trailLength ?? 5
  };

  const wrapper = document.querySelector('[data-trail="wrapper"]');

  if (!wrapper || window.innerWidth < options.minWidth) {
    return;
  }

  // State management
  const state = {
    trailInterval: null,
    globalIndex: 0,
    last: { x: 0, y: 0 },
    trailImageTimestamps: new Map(),
    trailImages: Array.from(document.querySelectorAll('[data-trail="item"]')),
    isActive: false
  };

  // Utility functions
  const MathUtils = {
    lerp: (a, b, n) => (1 - n) * a + n * b,
    distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1)
  };

  function getRelativeCoordinates(e, rect) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function activate(trailImage, x, y) {
    if (!trailImage) return;

    const rect = trailImage.getBoundingClientRect();
    const styles = {
      left: `${x - rect.width / 2}px`,
      top: `${y - rect.height / 2}px`,
      zIndex: state.globalIndex,
      display: 'block'
    };

    Object.assign(trailImage.style, styles);
    state.trailImageTimestamps.set(trailImage, Date.now());

	// Here, animate how the images will appear!
    gsap.fromTo(
      trailImage,
      { autoAlpha: 0, scale: 0.8 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 0.2,
        overwrite: true
      }
    );

    state.last = { x, y };
  }

  function fadeOutTrailImage(trailImage) {
    if (!trailImage) return;

    // Here, animate how the images will disappear!
    gsap.to(trailImage, {
      opacity: 0,
      scale: 0.2,
      duration: 0.8,
      ease: "expo.out",
      onComplete: () => {
        gsap.set(trailImage, { autoAlpha: 0 });
      }
    });
  }

  function handleOnMove(e) {
    if (!state.isActive) return;

    const rectWrapper = wrapper.getBoundingClientRect();
    const { x: relativeX, y: relativeY } = getRelativeCoordinates(e, rectWrapper);

    const distanceFromLast = MathUtils.distance(
      relativeX,
      relativeY,
      state.last.x,
      state.last.y
    );

    if (distanceFromLast > window.innerWidth / options.moveDistance) {
      const lead = state.trailImages[state.globalIndex % state.trailImages.length];
      const tail = state.trailImages[(state.globalIndex - options.trailLength) % state.trailImages.length];

      activate(lead, relativeX, relativeY);
      fadeOutTrailImage(tail);
      state.globalIndex++;
    }
  }

  function cleanupTrailImages() {
    const currentTime = Date.now();
    for (const [trailImage, timestamp] of state.trailImageTimestamps.entries()) {
      if (currentTime - timestamp > options.stopDuration) {
        fadeOutTrailImage(trailImage);
        state.trailImageTimestamps.delete(trailImage);
      }
    }
  }

  function startTrail() {
    if (state.isActive) return;

    state.isActive = true;
    wrapper.addEventListener("mousemove", handleOnMove);
    state.trailInterval = setInterval(cleanupTrailImages, 100);
  }

  function stopTrail() {
    if (!state.isActive) return;

    state.isActive = false;
    wrapper.removeEventListener("mousemove", handleOnMove);
    clearInterval(state.trailInterval);
    state.trailInterval = null;

    // Clean up remaining trail images
    state.trailImages.forEach(fadeOutTrailImage);
    state.trailImageTimestamps.clear();
  }

  // Initialize ScrollTrigger
  ScrollTrigger.create({
    trigger: wrapper,
    start: "top bottom",
    end: "bottom top",
    onEnter: startTrail,
    onEnterBack: startTrail,
    onLeave: stopTrail,
    onLeaveBack: stopTrail
  });

  // Clean up on window resize
  const handleResize = () => {
    if (window.innerWidth < options.minWidth && state.isActive) {
      stopTrail();
    } else if (window.innerWidth >= options.minWidth && !state.isActive) {
      startTrail();
    }
  };

  window.addEventListener('resize', handleResize);

  return () => {
    stopTrail();
    window.removeEventListener('resize', handleResize);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const imageTrail = initImageTrail({
    minWidth: 992,
    moveDistance: 15,
    stopDuration: 350,
    trailLength: 8
  });
});

// -----Letters Animation----- //
initLettersSlideUpTrue(); // Call the function to initialize the letters animation
