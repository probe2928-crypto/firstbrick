// Oriel — 스크롤 등장, 헤더 상태, 마지막 띠의 따라오는 빛
(function () {
  var d = document, root = d.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 헤더
  var onScroll = function () { root.classList.toggle("scrolled", window.scrollY > 24); };
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  // 스크롤 등장: 같은 부모 안에서는 차례로
  var sel = ".intro .lede, .intro .actions, .sec-head, .path > li, .defs > div, .chain > li, .principles > div, .road > li, .note-row, .post-card, .partner-line, .cta > *, .tg-contact, .way, .faq details, .prose > *, .steps > li";
  var els = [].slice.call(d.querySelectorAll(sel));
  if (reduce || !("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); }
  else {
    els.forEach(function (el) {
      var sib = el.parentNode ? [].slice.call(el.parentNode.children).filter(function (c) { return els.indexOf(c) > -1; }) : [];
      var i = Math.max(0, sib.indexOf(el));
      el.style.setProperty("--rd", Math.min(i, 6) * 90 + "ms");
      el.classList.add("rv");
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
    // 이미 보이는 것은 바로
    requestAnimationFrame(function () { els.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight * 0.95 && r.bottom > 0) el.classList.add("in"); }); });
  }

  // 마지막 띠: 포인터를 따라오는 빛
  var band = d.querySelector(".cta-band");
  if (band && !reduce) {
    band.addEventListener("pointermove", function (e) {
      var r = band.getBoundingClientRect();
      band.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      band.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    });
  }
})();
