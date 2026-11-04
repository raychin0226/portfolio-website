// Smooth scrolling for the whole page (single scroll container, matches juanmora.co feel)
const lenis = new Lenis({
  duration: 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Work page: expand the sidebar dot/label for whichever project is currently in view.
// Uses scroll-position comparison (not IntersectionObserver rootMargin, which proved
// unreliable with large percentage margins) — whichever section's top is closest to
// (without passing) the viewport midpoint is "current".
(function initWorkSidebarScrollSpy() {
  const projects = Array.from(document.querySelectorAll('.main-project-wrapper[id]'));
  const navItems = document.querySelectorAll('.sidebar-nav-item[data-project]');
  if (!projects.length || !navItems.length) return;

  const setCurrent = (id) => {
    navItems.forEach((item) => {
      item.classList.toggle('is-current', item.dataset.project === id);
    });
  };

  let ticking = false;

  const updateCurrent = () => {
    const line = window.innerHeight / 2;
    let current = projects[0];

    for (const section of projects) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= line) {
        current = section;
      }
    }

    setCurrent(current.id);
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateCurrent);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  updateCurrent();
})();
