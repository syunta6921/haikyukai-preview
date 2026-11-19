(function () {
  "use strict";

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- header state ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("globalNav");
  var header = document.getElementById("siteHeader");
  function closeNav() {
    nav.classList.remove("open");
    header.classList.remove("menu-open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "メニューを開く");
    document.body.style.overflow = "";
  }
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    header.classList.toggle("menu-open", open);
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    document.body.style.overflow = open ? "hidden" : "";
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }


  /* ---------- hero slideshow ---------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var slideIdx = 0;
    setInterval(function () {
      slides[slideIdx].classList.remove("is-active");
      slideIdx = (slideIdx + 1) % slides.length;
      slides[slideIdx].classList.add("is-active");
    }, 5500);
  }

  /* ---------- scroll progress / to-top ---------- */
  var progress = document.getElementById("scrollProgress");
  var toTop = document.getElementById("toTop");
  function onScrollFx() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress && max > 0) progress.style.width = (window.scrollY / max) * 100 + "%";
    if (toTop) toTop.classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScrollFx, { passive: true });
  onScrollFx();
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- gallery filters ---------- */
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll(".g-filter"));
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var f = btn.getAttribute("data-filter");
      document.querySelectorAll("#galleryGrid .g-item").forEach(function (item) {
        var tag = item.querySelector(".g-tag");
        var cat = tag ? tag.textContent.trim() : "";
        item.classList.toggle("is-hidden", f !== "all" && cat !== f);
      });
    });
  });

  /* ---------- lightbox ---------- */
  var items = Array.prototype.slice.call(
    document.querySelectorAll("#galleryGrid .g-item")
  );
  var lightbox = document.getElementById("lightbox");
  var lbImage = document.getElementById("lbImage");
  var lbCaption = document.getElementById("lbCaption");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var current = 0;
  var lastFocus = null;

  var visibleItems = items.slice();
  function show(idx) {
    if (!visibleItems.length) return;
    current = (idx + visibleItems.length) % visibleItems.length;
    var img = visibleItems[current].querySelector("img");
    lbImage.src = visibleItems[current].getAttribute("data-full");
    lbImage.alt = img ? img.alt : "";
    lbCaption.textContent = lbImage.alt;
  }
  function openLb(idx, trigger) {
    lastFocus = trigger || null;
    visibleItems = items.filter(function (it) { return !it.classList.contains("is-hidden"); });
    var vIdx = visibleItems.indexOf(trigger);
    show(vIdx >= 0 ? vIdx : 0);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }
  function closeLb() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  items.forEach(function (item, i) {
    item.addEventListener("click", function () { openLb(i, item); });
  });
  lbClose.addEventListener("click", closeLb);
  lbPrev.addEventListener("click", function () { show(current - 1); });
  lbNext.addEventListener("click", function () { show(current + 1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
})();
