import { data } from "./data.js";
import { initLettersSlideUpTrue } from "./global.js"; // Import the function

// -----Letters Animation-in on load----- /

const letters = document.querySelectorAll(".svg_letter_wrap > path"); // Select all direct child path elements

if (letters.length > 0) {
  // Animate the letters with staggered effects
  gsap.from(letters, {
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
    delay: 0.8, // Delay before the scaling animation starts
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

// Function to check if the device is mobile
function isMobileDevice() {
  return window.innerWidth < 768; // Common breakpoint for mobile devices
}

const skillItems = document.querySelectorAll(".skills_detail_item");
const skillImages = document.querySelectorAll(".services_skills_image");
const skillImagesContainer = document.querySelector(".services_skills_images");

// Add a style tag to the head for our custom CSS
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  .mobile-hidden {
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
`;
document.head.appendChild(styleTag);

// Function to setup skill animations for desktop
function setupSkillAnimations() {
  // Remove mobile-hidden class if present
  if (skillImagesContainer) {
    skillImagesContainer.classList.remove("mobile-hidden");
  } else {
    skillImages.forEach((img) => img.classList.remove("mobile-hidden"));
  }

  // Set initial state for desktop animations
  gsap.set(skillImages, {
    opacity: 0,
    scale: 0,
  });

  // Setup ScrollTrigger animations
  skillItems.forEach((item, index) => {
    if (index < skillImages.length) {
      // Safety check
      ScrollTrigger.create({
        trigger: item,
        start: () => `top ${skillImages[index].getBoundingClientRect().top}px`,
        end: () => {
          if (index === skillItems.length - 1) {
            // For the last image, calculate its center point
            const rect = skillImages[index].getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            return `bottom ${centerY}px`;
          }
          // Other images end at their top
          return `bottom ${skillImages[index].getBoundingClientRect().top}px`;
        },
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(skillImages[index], {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        },
        onLeave: () => {
          gsap.to(skillImages[index], {
            opacity: 0,
            scale: 0,
            duration: 0.4,
            ease: "power2.out",
          });
        },
        onEnterBack: () => {
          gsap.to(skillImages[index], {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(skillImages[index], {
            opacity: 0,
            scale: 0,
            duration: 0.4,
            ease: "power2.out",
          });
        },
      });
    }
  });
}

// Function to hide all images on mobile
function hideAllSkillImages() {
  // Kill any active ScrollTriggers for skill images
  ScrollTrigger.getAll().forEach((trigger) => {
    if (
      trigger.vars.trigger &&
      trigger.vars.trigger.classList &&
      trigger.vars.trigger.classList.contains("skills_detail_item")
    ) {
      trigger.kill();
    }
  });

  // Add mobile-hidden class
  if (skillImagesContainer) {
    skillImagesContainer.classList.add("mobile-hidden");
  } else {
    skillImages.forEach((img) => img.classList.add("mobile-hidden"));
  }

  // Force GSAP to reset them as well
  gsap.set(skillImages, {
    opacity: 0,
    clearProps: "scale", // Clear any scale properties
  });
}

// Check if we should apply mobile or desktop behavior
function checkViewportSize() {
  if (isMobileDevice()) {
    hideAllSkillImages();
  } else {
    // Check if desktop animations are already set up
    const triggers = ScrollTrigger.getAll();
    const hasSkillTriggers = triggers.some(
      (trigger) =>
        trigger.vars.trigger &&
        trigger.vars.trigger.classList &&
        trigger.vars.trigger.classList.contains("skills_detail_item"),
    );

    if (!hasSkillTriggers) {
      setupSkillAnimations();
    }
  }
}

// Initial setup
checkViewportSize();

// Simple debounce function
function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Add resize event handling
window.addEventListener("resize", debounce(checkViewportSize, 250));

// Additionally, check on page load in case DOM elements weren't fully ready
window.addEventListener("load", checkViewportSize);

// -----Letters Animation----- //
initLettersSlideUpTrue(); // Call the function to initialize the letters animation
