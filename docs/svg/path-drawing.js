// docs/svg/path-drawing.js
// Demo 1 (scroll-triggered) is the only demo needing JS. It measures the
// path's real on-screen length with getTotalLength() rather than relying
// on the pathLength="100" normalization attribute Demos 2/3 use -- this
// is the technique to reach for when you don't want to hand-specify an
// arbitrary normalized length in the markup (e.g. for a dynamically
// generated path). Demos 2 and 3 are pure CSS and need no JS at all.

const scrollPath = document.getElementById('draw-scroll-path');
const pathLength = scrollPath.getTotalLength();
scrollPath.style.strokeDasharray = `${pathLength}`;
scrollPath.style.strokeDashoffset = `${pathLength}`;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        scrollPath.style.strokeDashoffset = '0';
        observer.unobserve(scrollPath);
      }
    });
  },
  { threshold: 0.4 }
);

observer.observe(scrollPath);
