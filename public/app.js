// Oriel — 스크롤 등장, 헤더 상태, 마지막 띠의 따라오는 빛
(function () {
  var d = document, root = d.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 헤더
  var onScroll = function () { root.classList.toggle("scrolled", window.scrollY > 24); };
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  // 스크롤 등장: 같은 부모 안에서는 차례로
  var sel = ".intro .lede, .intro .actions, .sec-head, .path > li, .defs > div, .chain > li, .principles > div, .road > li, .note-row, .post-card, .partner-line, .cta > *, .tg-contact, .way, .faq details, .prose > *, .steps > li, .holds > li, .facts > div, .talk-list > div";
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

  // 활동 일지 사진: 크게 보기 (키보드 ←/→/Esc, 밀어서 넘기기)
  var shots = [].slice.call(d.querySelectorAll(".post .post-cover, .post .prose img, .post .gallery img"));
  if (shots.length && window.HTMLDialogElement) {
    var ko = root.lang === "ko";
    var L = ko ? { open: "사진 크게 보기", close: "닫기", prev: "이전", next: "다음", label: "사진" } : { open: "View photo larger", close: "Close", prev: "Previous", next: "Next", label: "Photo" };
    var dlg = d.createElement("dialog"); dlg.className = "lb"; dlg.setAttribute("aria-label", L.label);
    dlg.innerHTML = '<div class="lb-stage"><img alt=""></div><div class="lb-bar"><span class="lb-count" aria-live="polite"></span><span class="lb-nav"><button type="button" class="lb-btn lb-prev" aria-label="' + L.prev + '">&larr;</button><button type="button" class="lb-btn lb-next" aria-label="' + L.next + '">&rarr;</button></span><button type="button" class="lb-btn lb-close">' + L.close + '</button></div>';
    d.body.appendChild(dlg);
    var big = dlg.querySelector(".lb-stage img"), count = dlg.querySelector(".lb-count"), prev = dlg.querySelector(".lb-prev"), next = dlg.querySelector(".lb-next"), cur = 0, opener = null;
    var show = function (i) {
      cur = (i + shots.length) % shots.length;
      big.src = shots[cur].currentSrc || shots[cur].src; big.alt = shots[cur].alt || "";
      big.style.animation = "none"; void big.offsetWidth; big.style.animation = "";
      count.textContent = (cur + 1) + " / " + shots.length;
    };
    prev.hidden = next.hidden = shots.length < 2;
    shots.forEach(function (img, i) {
      img.classList.add("zoomable"); img.tabIndex = 0; img.setAttribute("role", "button");
      img.setAttribute("aria-label", (img.alt ? img.alt + " — " : "") + L.open);
      var open = function () { opener = img; show(i); dlg.showModal(); dlg.querySelector(".lb-close").focus(); };
      img.addEventListener("click", open);
      img.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    prev.addEventListener("click", function () { show(cur - 1); });
    next.addEventListener("click", function () { show(cur + 1); });
    dlg.querySelector(".lb-close").addEventListener("click", function () { dlg.close(); });
    dlg.querySelector(".lb-stage").addEventListener("click", function (e) { if (e.target !== big) dlg.close(); });
    dlg.addEventListener("close", function () { if (opener) opener.focus(); });
    dlg.addEventListener("keydown", function (e) {
      if (shots.length > 1 && e.key === "ArrowLeft") { e.preventDefault(); show(cur - 1); }
      if (shots.length > 1 && e.key === "ArrowRight") { e.preventDefault(); show(cur + 1); }
    });
    var x0 = null;
    dlg.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", function (e) {
      if (x0 === null || shots.length < 2) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    });
  }
})();
