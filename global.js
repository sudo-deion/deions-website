// ----PIXELATED GRID LOAD---- //
// Code that runs on pageload
gsap.to(".load_grid-item", {
    opacity: 0,
    duration: 0.001,
    stagger: { amount: 0.5, from: "random" },
    onComplete: () => {
      gsap.set(".load_grid", { display: "none" });
    },
  });
  
  // Code that runs on click of a link
  $("a").on("click", function (e) {
    if (
      $(this).prop("hostname") === window.location.host &&
      $(this).attr("href").indexOf("#") === -1 &&
      $(this).attr("target") !== "_blank"
    ) {
      e.preventDefault();
      let destination = $(this).attr("href");
      gsap.set(".load_grid", { display: "grid" });
      gsap.fromTo(
        ".load_grid-item",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.001,
          stagger: { amount: 0.5, from: "random" },
          onComplete: () => {
            window.location = destination;
          },
        },
      );
    }
  });
  
  // On click of the back button
  window.onpageshow = function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  };
  
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
      delay: 0.2,
      yPercent: 100,
      duration: 1.3,
      ease: "circ.out",
      stagger: { amount: 0.6 }
    });
    createScrollTrigger($(this), tl);
  });
  
  $("[letters-slide-up-true]").each(function (index) {
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
  
  // Avoid flash of unstyled content
  gsap.set("[text-split]", { opacity: 1 });
  
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
  