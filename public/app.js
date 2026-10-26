// First Brick — 첫 화면: 첫 벽돌이 먼저 놓이고, 나머지가 한 층씩 쌓인다 (한 번만)
(function () {
  document.documentElement.classList.add("js");
  var house = document.querySelector(".house");
  if (!house) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { house.classList.add("laid"); return; }
  requestAnimationFrame(function () { requestAnimationFrame(function () { house.classList.add("laid"); }); });
})();
