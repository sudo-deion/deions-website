// ----PIXELATED GRID LOAD---- //
// Code that runs on pageload
function adjustGrid() {
  return new Promise((resolve) => {
    const transition = document.querySelector('.transition');

    // Get computed style of the grid and extract the number of columns
    const computedStyle = window.getComputedStyle(transition);
    const gridTemplateColumns = computedStyle.getPropertyValue('grid-template-columns');
    const columns = gridTemplateColumns.split(' ').length; // Count the number of columns

    const blockSize = window.innerWidth / columns;
    const rowsNeeded = Math.ceil(window.innerHeight / blockSize);

    // Update grid styles
    transition.style.gridTemplateRows = `repeat(${rowsNeeded}, ${blockSize}px)`;

    // Calculate the total number of blocks needed
    const totalBlocks = columns * rowsNeeded;

    // Clear existing blocks
    transition.innerHTML = '';

    // Generate blocks dynamically
    for (let i = 0; i < totalBlocks; i++) {
      const block = document.createElement('div');
      block.classList.add('transition-block');
      transition.appendChild(block);
    }

    // Resolve the Promise after grid creation is complete
    resolve();
  });
}
document.addEventListener("DOMContentLoaded", () => {
  adjustGrid().then(() => {
    let pageLoadTimeline = gsap.timeline({
      onStart: () => {
        gsap.set(".transition", { background: "transparent" });
      },
      onComplete: () => {
        gsap.set(".transition", { display: "none" });
      },
      defaults: {
        ease: "linear"
      }
    });

    // Play the timeline only after the grid is ready
    pageLoadTimeline.to(".transition-block", {
      opacity: 0,
      duration: 0.1,
      stagger: { amount: 0.75, from: "random" },
    }, 0.5);
  });

  // Pre-process all valid links
  const validLinks = Array.from(document.querySelectorAll("a")).filter(link => {
    const href = link.getAttribute("href") || "";
    const hostname = new URL(link.href, window.location.origin).hostname;

    return (
      hostname === window.location.hostname && // Same domain
      !href.startsWith("#") &&                 // Not an anchor link
      link.getAttribute("target") !== "_blank" && // Not opening in a new tab
      !link.hasAttribute("data-transition-prevent") // No 'data-transition-prevent' attribute
    );
  });

  // Add event listeners to pre-processed valid links
  validLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const destination = link.href;

      // Show loading grid with animation
      gsap.set(".transition", { display: "grid" });
      gsap.fromTo(
        ".transition-block",
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.001,
          ease: "linear",
          stagger: { amount: 0.5, from: "random" },
          onComplete: () => {
            window.location.href = destination;
          }
        }
      );
    });
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

  window.addEventListener('resize', adjustGrid);
});

  // -----LENIS SMOOTH SCROLL----- //
  "use strict"; // fix lenis in safari

  let lenis;
  if (Webflow.env("editor") === undefined) {
    // Initialize Lenis
    lenis = new Lenis({});

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker for Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
  }

  // Event listeners for starting, stopping, and toggling Lenis
  $("[data-lenis-start]").on("click", function () {
    lenis.start();
  });
  $("[data-lenis-stop]").on("click", function () {
    lenis.stop();
  });
  $("[data-lenis-toggle]").on("click", function () {
    $(this).toggleClass("stop-scroll");
    if ($(this).hasClass("stop-scroll")) {
      lenis.stop();
    } else {
      lenis.start();
    }
  });

  // -----TEXT ANIMATIONS----- //
  // Split text into spans
  let typeSplit = new SplitType("[text-split]", {
    types: "words, chars",
    tagName: "span"
  });

  // Link timelines to scroll position
  function createScrollTrigger(triggerElement, timeline) {
    // Reset tl when scroll out of view past bottom of screen
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top bottom",
      onLeaveBack: () => {
        timeline.progress(0);
        timeline.pause();
      }
    });
    // Play tl when scrolled into view (80% from top of screen)
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 80%",
      onEnter: () => timeline.play()
    });
  }

  $("[words-slide-up]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".word"), {
      opacity: 0,
      yPercent: 100,
      duration: 0.6,
      ease: "circ.out)",
    });
    createScrollTrigger($(this), tl);
  });

  $("[letters-slide-up]").each(function (index) {
    let tl = gsap.timeline({ paused: false });
    tl.from($(this).find(".char"), {
      delay: 0.8,
      yPercent: 100,
      duration: 1.3,
      ease: "circ.out",
      stagger: { amount: 0.6 }
    });
    createScrollTrigger($(this), tl);
  });

  $("[letters-slide-up-true]").each(function () {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".char"), {
      yPercent: 100,
      duration: 0.6,
      ease: "circ.out",
      stagger: { amount: 0.2 }
    });
    createScrollTrigger($(this), tl);
  });

  $("[letters-fade-in]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".char"), {
      delay: 0.8,
      opacity: 0,
      duration: 0.2,
      ease: "power1.out",
      stagger: { amount: 0.8 }
    });
    createScrollTrigger($(this), tl);
  });

  $("[scrub-each-word]").each(function (index) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: "top 90%",
        end: "top center",
        scrub: true
      }
    });
    tl.from($(this).find(".word"), {
      opacity: 0.2,
      duration: 1,
      ease: "power1.out",
      stagger: { each: 0.4 }
    });
  });

  export function initLettersSlideUpTrue() {
    $("[letters-slide-up-home='sticky']").each(function () {
      let tl = gsap.timeline({ paused: true });

      // Animate each character in the element
      tl.from($(this).find(".char"), {
        yPercent: 100,
        duration: 0.6,
        ease: "circ.out",
        stagger: { amount: 0.2 }
      });

      // Create a ScrollTrigger for the letters animation
      ScrollTrigger.create({
        trigger: this,
        start: "top 90%", // Adjust this value as needed
        end: "top center", // Adjust this value as needed
        scrub: true,
        onEnter: () => {
          tl.play(); // Play the letters animation when entering
        },
        onLeaveBack: () => {
          tl.progress(0); // Reset the timeline when scrolling back
          tl.pause();
        }
      });
    });
  }

  // Avoid flash of unstyled content
  gsap.set("[text-split]", { opacity: 1 });


  // -----HAMBURGER MENU----- //
  // Number of clicks on the trigger element initially set on 0
  let numOfClicks = 0;
  // Get trigger element
  const trigger = document.getElementById("menu-trigger");
  // Get body element
  const bodyEl = document.getElementsByTagName("body")[0];

  // Set onclick function to trigger element
  trigger.onclick = () => {
    numOfClicks += 1;
    // Check if number of clicks is an even value:
    // odd value - first click, even value - second click
    const isNumOfClicksEven = numOfClicks % 2 === 0;
    // On first click set body's overflow property to "auto",
    // On second click set body's overflow property to "hidden"
    isNumOfClicksEven
      ?
      (bodyEl.style.overflow = "auto") :
      (bodyEl.style.overflow = "hidden");
  };

  // -----CURRENT TIMEZONE----- //
  function initDynamicCurrentTime() {
    const defaultTimezone = "America/Los_Angeles";

    // Helper function to format numbers with leading zero
    const formatNumber = (number) => number.toString().padStart(2, '0');

    // Function to create a time formatter with the correct timezone
    const createFormatter = (timezone) => {
      return new Intl.DateTimeFormat([], {
        timeZone: timezone,
        timeZoneName: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true, // Optional: Remove to match your simpler script
      });
    };

    // Function to parse the formatted string into parts
    const parseFormattedTime = (formattedDateTime) => {
      const match = formattedDateTime.match(/(\d+):(\d+):(\d+)\s*([\w+]+)/);
      if (match) {
        return {
          hours: match[1],
          minutes: match[2],
          seconds: match[3],
          timezone: match[4], // Handles both GMT+X and CET cases
        };
      }
      return null;
    };

    // Function to update the time for all elements
    const updateTime = () => {
      document.querySelectorAll('[data-current-time]').forEach((element) => {
        const timezone = element.getAttribute('data-current-time') || defaultTimezone;
        const formatter = createFormatter(timezone);
        const now = new Date();
        const formattedDateTime = formatter.format(now);

        const timeParts = parseFormattedTime(formattedDateTime);
        if (timeParts) {
          const {
            hours,
            minutes,
            seconds,
            timezone
          } = timeParts;

          // Update child elements if they exist
          const hoursElem = element.querySelector('[data-current-time-hours]');
          const minutesElem = element.querySelector('[data-current-time-minutes]');
          const timezoneElem = element.querySelector('[data-current-time-timezone]');

          if (hoursElem) hoursElem.textContent = hours;
          if (minutesElem) minutesElem.textContent = minutes;
          if (timezoneElem) timezoneElem.textContent = timezone;
        }
      });
    };

    // Initial update and interval for subsequent updates
    updateTime();
    setInterval(updateTime, 1000);
  }

  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initDynamicCurrentTime();
  });

  // -----BUTTON ANIMATION----- //
  function initButtonCharacterStagger() {
    const offsetIncrement = 0.01; // Transition offset increment in seconds
    const buttons = document.querySelectorAll('[data-button-animate-chars]');

    buttons.forEach(button => {
      const text = button.textContent; // Get the button's text content
      button.innerHTML = ''; // Clear the original content

      [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.transitionDelay = `${index * offsetIncrement}s`;

        // Handle spaces explicitly
        if (char === ' ') {
          span.style.whiteSpace = 'pre'; // Preserve space width
        }

        button.appendChild(span);
      });
    });
  }

  // Initialize Button Character Stagger Animation
  document.addEventListener('DOMContentLoaded', () => {
    initButtonCharacterStagger();
  });

  const elements = document.querySelectorAll('[data-initial-color]');

  elements.forEach(element => {
    // Set initial color
    element.style.color = '#818181'; // Initial grey color

    element.addEventListener('mouseenter', () => {
      element.style.color = '#f2f2f2'; // Change to the desired color on hover
    });

    element.addEventListener('mouseleave', () => {
      element.style.color = '#818181'; // Revert to initial grey color
    });
  });
