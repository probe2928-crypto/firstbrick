// Oriel — 첫 화면: 도면 선이 그려지고 오리엘 창에 불이 들어온다 (한 번만)
(function () {
  document.documentElement.classList.add("js");
  var house = document.querySelector(".house");
  if (!house) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { house.classList.add("laid"); return; }
  requestAnimationFrame(function () { requestAnimationFrame(function () { house.classList.add("laid"); }); });
})();
