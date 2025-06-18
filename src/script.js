document.addEventListener('DOMContentLoaded', () => {
  const reviewsTrack = document.querySelector('.reviews-carousel__track');
  const navArrowLeft = document.querySelector('.nav-arrow--left');
  const navArrowRight = document.querySelector('.nav-arrow--right');
  const paginationDotsContainer = document.querySelector('.pagination');

  let reviewCards = Array.from(document.querySelectorAll('.review-card'));
  const originalCardCount = reviewCards.length;

  let currentSlideIndex;
  let cardWidth;
  let gapWidth;
  let cardsVisible;
  const transitionDuration = 600;

  function getCardsVisible() {
    switch (true) {
      case window.innerWidth <= 992:
        return 1;
      case window.innerWidth <= 1200:
        return 2;
      default:
        return 3;
    }
  }

  function cloneCards(cardList, count, direction = 'prepend') {
    for (let i = 0; i < count; i++) {
      const index = direction === 'prepend' ? cardList.length - 1 - i : i;
      const clone = cardList[index].cloneNode(true);
      clone.classList.add('review-card--clone');
      direction === 'prepend'
        ? reviewsTrack.prepend(clone)
        : reviewsTrack.append(clone);
    }
  }

  function updateCarouselState() {
    const existingClones = reviewsTrack.querySelectorAll('.review-card--clone');
    existingClones.forEach((clone) => clone.remove());

    cardsVisible = getCardsVisible();

    const firstReviewCard = reviewsTrack.querySelector(
      '.review-card:not(.review-card--clone)',
    );
    if (!firstReviewCard) {
      console.warn('No original review cards found in the carousel track.');
      return;
    }

    cardWidth = firstReviewCard.offsetWidth;
    const computedTrackStyle = window.getComputedStyle(reviewsTrack);
    gapWidth = parseFloat(computedTrackStyle.gap) || 0;

    if (originalCardCount >= cardsVisible) {
      cloneCards(reviewCards, cardsVisible, 'prepend');
      cloneCards(reviewCards, cardsVisible, 'append');
    }

    reviewCards = Array.from(reviewsTrack.querySelectorAll('.review-card'));
    currentSlideIndex = cardsVisible;

    updateCarouselPosition(false);
    updatePaginationDots();
  }

  function updateCarouselPosition(animate = true) {
    const offset = currentSlideIndex * (cardWidth + gapWidth);
    reviewsTrack.style.transition = animate
      ? `transform ${transitionDuration / 1000}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`
      : 'none';
    reviewsTrack.style.transform = `translateX(-${offset}px)`;
  }

  function handleNextClick() {
    currentSlideIndex++;
    updateCarouselPosition();
  }

  function handlePrevClick() {
    currentSlideIndex--;
    updateCarouselPosition();
  }

  function updatePaginationDots() {
    if (!paginationDotsContainer) return;

    paginationDotsContainer.innerHTML = '';

    for (let i = 0; i < originalCardCount; i++) {
      const dot = document.createElement('span');
      dot.classList.add('pagination__dot');
      dot.dataset.cardIndex = i;

      dot.addEventListener('click', (e) => {
        const targetOriginalIndex = parseInt(e.target.dataset.cardIndex);
        currentSlideIndex = targetOriginalIndex + cardsVisible;
        updateCarouselPosition(true);
        if (reviewsTrack.style.transition === 'none') {
          updatePaginationDots();
        }
      });

      paginationDotsContainer.appendChild(dot);
    }

    const dots = paginationDotsContainer.querySelectorAll('.pagination__dot');
    const activeOriginalIndex =
      (currentSlideIndex - cardsVisible) % originalCardCount;

    dots.forEach((dot) => dot.classList.remove('pagination__dot--active'));
    if (dots[activeOriginalIndex]) {
      dots[activeOriginalIndex].classList.add('pagination__dot--active');
    }
  }

  function initializeCarousel() {
    updateCarouselState();
  }
  navArrowLeft?.addEventListener('click', handlePrevClick);
  navArrowRight?.addEventListener('click', handleNextClick);
  reviewsTrack.addEventListener('transitionend', () => {
    if (currentSlideIndex >= originalCardCount + cardsVisible) {
      currentSlideIndex = cardsVisible;
      updateCarouselPosition(false);
    } else if (currentSlideIndex < cardsVisible) {
      currentSlideIndex = originalCardCount + cardsVisible - 1;
      updateCarouselPosition(false);
    }
    updatePaginationDots();
  });
  window.addEventListener('load', initializeCarousel);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initializeCarousel();
    }, 250);
  });

  initializeCarousel();
});
