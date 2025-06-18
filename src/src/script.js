document.addEventListener('DOMContentLoaded', () => {
  const reviewsTrack = document.querySelector('.reviews-carousel__track');
  const navArrowLeft = document.querySelector('.nav-arrow--left');
  const navArrowRight = document.querySelector('.nav-arrow--right');
  const paginationDotsContainer = document.querySelector('.pagination');

  let reviewCards = Array.from(document.querySelectorAll('.review-card')); // Initial array of actual cards
  const originalCardCount = reviewCards.length; // Number of original cards

  // Important variables for the carousel
  let currentSlideIndex; // Current index of the active slide (including clones)
  let cardWidth; // Width of a single card
  let gapWidth; // Width of the gap between cards
  let cardsVisible; // Number of cards visible at once
  let transitionDuration = 600; // Animation duration in ms, should match CSS

  // --- Function to update all metrics and set up clones ---
  function updateCarouselState() {
    // Clear all existing clones before re-setup
    const existingClones = reviewsTrack.querySelectorAll('.review-card--clone');
    existingClones.forEach((clone) => clone.remove());

    // Dynamically determine cardsVisible (previously cardsPerView)
    // This logic should match your CSS media queries for the number of visible cards
    if (window.innerWidth <= 768) {
      cardsVisible = 1;
    } else if (window.innerWidth <= 992) {
      // Keep 1 if it's also 1 card on tablet-md
      cardsVisible = 1;
    } else if (window.innerWidth <= 1200) {
      cardsVisible = 2;
    } else {
      cardsVisible = 3;
    }

    const firstReviewCard = reviewsTrack.querySelector(
      '.review-card:not(.review-card--clone)',
    ); // Get an original card
    if (!firstReviewCard) {
      console.warn('No original review cards found in the carousel track.');
      return;
    }

    // Get actual card width and CSS gap
    cardWidth = firstReviewCard.offsetWidth;
    const computedTrackStyle = window.getComputedStyle(reviewsTrack);
    gapWidth = parseFloat(computedTrackStyle.gap) || 0; // If gap is not set, it will be 0

    // Duplicate cards to create an infinite effect
    // Duplicate the last `cardsVisible` cards and add them to the beginning
    for (let i = 0; i < cardsVisible; i++) {
      const clone = reviewCards[originalCardCount - 1 - i].cloneNode(true);
      clone.classList.add('review-card--clone');
      reviewsTrack.prepend(clone);
    }

    // Duplicate the first `cardsVisible` cards and add them to the end
    for (let i = 0; i < cardsVisible; i++) {
      const clone = reviewCards[i].cloneNode(true);
      clone.classList.add('review-card--clone');
      reviewsTrack.append(clone);
    }

    // Update `reviewCards` after adding clones to include all elements
    reviewCards = Array.from(reviewsTrack.querySelectorAll('.review-card'));

    // Initial index is set to the first "true" card
    // (after the clones at the beginning)
    currentSlideIndex = cardsVisible;

    // Set initial position without animation
    updateCarouselPosition(false);

    updatePaginationDots(); // Update pagination for true cards
  }

  // --- Function to update carousel position ---
  function updateCarouselPosition(animate = true) {
    // Calculate offset
    // (currentSlideIndex * (card width + gap width))
    const offset = currentSlideIndex * (cardWidth + gapWidth);

    // Set transition if animation is needed
    if (animate) {
      reviewsTrack.style.transition = `transform ${transitionDuration / 1000}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    } else {
      reviewsTrack.style.transition = 'none'; // Disable animation for instant transition
    }

    reviewsTrack.style.transform = `translateX(-${offset}px)`;
  }

  // --- Click handlers for navigation arrows ---
  function handleNextClick() {
    currentSlideIndex++;
    updateCarouselPosition();
  }

  function handlePrevClick() {
    currentSlideIndex--;
    updateCarouselPosition();
  }

  if (navArrowLeft) {
    navArrowLeft.addEventListener('click', handlePrevClick);
  }
  if (navArrowRight) {
    navArrowRight.addEventListener('click', handleNextClick);
  }

  // --- Logic for infinite loop after animation completes ---
  reviewsTrack.addEventListener('transitionend', () => {
    // If we reached duplicated cards at the end of the original set
    // (currentSlideIndex points to the first cloned card after originals)
    if (currentSlideIndex >= originalCardCount + cardsVisible) {
      // Jump to the beginning of the original cards (to the first clone from the start)
      currentSlideIndex = cardsVisible;
      updateCarouselPosition(false); // Instant transition without animation
    }
    // If we reached duplicated cards at the beginning
    // (currentSlideIndex points to the last clone before the original cards)
    else if (currentSlideIndex < cardsVisible) {
      // Jump to the end of the original cards (to the last clone at the end)
      currentSlideIndex = originalCardCount + cardsVisible - 1;
      updateCarouselPosition(false); // Instant transition without animation
    }
    updatePaginationDots(); // Update pagination after a potential "jump"
  });

  // --- Function to update pagination dots ---
  function updatePaginationDots() {
    if (!paginationDotsContainer) return;

    // Clear existing dots
    paginationDotsContainer.innerHTML = '';

    // Create dots only for original cards
    for (let i = 0; i < originalCardCount; i++) {
      const dot = document.createElement('span');
      dot.classList.add('pagination__dot');
      dot.dataset.cardIndex = i; // Store original card index

      dot.addEventListener('click', (e) => {
        const targetOriginalIndex = parseInt(e.target.dataset.cardIndex);
        // We want to go to the original card located at index targetOriginalIndex + cardsVisible (due to clones at the beginning)
        currentSlideIndex = targetOriginalIndex + cardsVisible;
        updateCarouselPosition(true); // Animated transition
        // After click, pagination will update in transitionend, or if no transition, then immediately here
        if (reviewsTrack.style.transition === 'none') {
          updatePaginationDots();
        }
      });
      paginationDotsContainer.appendChild(dot);
    }

    // Set active dot
    const dots = paginationDotsContainer.querySelectorAll('.pagination__dot');
    // Active card is current index minus number of clones at the beginning
    const activeOriginalIndex =
      (currentSlideIndex - cardsVisible) % originalCardCount;

    // Remove active class from all dots
    dots.forEach((dot) => dot.classList.remove('pagination__dot--active'));
    // Add active class to the corresponding dot
    if (dots[activeOriginalIndex]) {
      dots[activeOriginalIndex].classList.add('pagination__dot--active');
    }
  }

  // --- Carousel initialization ---
  const initializeCarousel = () => {
    updateCarouselState();
  };

  // Initialization on page load
  window.addEventListener('load', initializeCarousel);
  // Carousel update on window resize (with timeout for optimization)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initializeCarousel();
    }, 250);
  });

  // Additionally call on DOMContentLoaded in case images are already cached
  initializeCarousel();
});
