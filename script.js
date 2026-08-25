/* Bharadwaj Jakkula — portfolio motion system (GSAP + ScrollTrigger) */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  // Graceful degradation: no GSAP or reduced motion → show everything, keep CSS-only effects
  if (!hasGSAP || reduceMotion) {
    document.querySelectorAll(
      ".reveal-line, .tl-card, .skill-card, .stat, .research-item, .honor-card, .certs"
    ).forEach(function (el) { el.style.opacity = "1"; });
    document.querySelectorAll("[data-counter]").forEach(function (el) {
      el.textContent = el.getAttribute("data-counter");
    });
    document.querySelectorAll(".timeline-line-fill").forEach(function (el) {
      el.style.transform = "scaleY(1)";
    });
    if (hasGSAP && !reduceMotion) return; // unreachable, kept for clarity
    if (!reduceMotion) return;
  }

  if (!hasGSAP) return;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Character splitter (no paid SplitText needed) ---------- */
  function splitChars(el) {
    var text = el.textContent;
    el.setAttribute("aria-hidden", "true");
    el.textContent = "";
    var frag = document.createDocumentFragment();
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement("span");
      span.className = "char";
      span.textContent = text[i] === " " ? " " : text[i];
      frag.appendChild(span);
    }
    el.appendChild(frag);
    return el.querySelectorAll(".char");
  }

  function splitWords(el) {
    var text = el.textContent;
    el.setAttribute("aria-label", text);
    el.textContent = "";
    var frag = document.createDocumentFragment();
    text.split(" ").forEach(function (word, i, arr) {
      var outer = document.createElement("span");
      outer.className = "word";
      outer.setAttribute("aria-hidden", "true");
      var inner = document.createElement("span");
      inner.textContent = word;
      outer.appendChild(inner);
      frag.appendChild(outer);
      if (i < arr.length - 1) frag.appendChild(document.createTextNode(" "));
    });
    el.appendChild(frag);
    return el.querySelectorAll(".word > span");
  }

  if (reduceMotion) return;

  /* ---------- Hero entrance ---------- */
  var heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });

  document.querySelectorAll("[data-split]").forEach(function (line, idx) {
    var chars = splitChars(line);
    // Spread the gradient across the whole word even though each char paints
    // its own background (see .split-line--accent .char in CSS)
    if (line.classList.contains("split-line--accent")) {
      var n = chars.length;
      chars.forEach(function (ch, i) {
        ch.style.backgroundSize = n * 100 + "% 100%";
        ch.style.backgroundPosition = (n > 1 ? (i / (n - 1)) * 100 : 0) + "% 0";
      });
    }
    heroTl.from(chars, {
      yPercent: 110,
      rotateX: -50,
      opacity: 0,
      duration: 0.9,
      stagger: 0.028
    }, idx * 0.12);
  });

  heroTl.to(".hero .reveal-line", {
    opacity: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.1,
    startAt: { y: 22 }
  }, 0.45);

  /* Hero parallax on scroll */
  gsap.to(".hero-title", {
    yPercent: -18,
    opacity: 0.25,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
  });

  /* ---------- Section titles: word reveal ---------- */
  document.querySelectorAll("[data-split-words]").forEach(function (title) {
    var words = splitWords(title);
    gsap.from(words, {
      yPercent: 115,
      duration: 0.8,
      stagger: 0.06,
      ease: "expo.out",
      scrollTrigger: { trigger: title, start: "top 88%" }
    });
  });

  /* ---------- Generic reveals ---------- */
  function reveal(selector, vars) {
    document.querySelectorAll(selector).forEach(function (el) {
      gsap.fromTo(el,
        Object.assign({ opacity: 0, y: 28 }, vars && vars.from),
        {
          opacity: 1, y: 0,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" }
        });
    });
  }

  reveal(".about-lede, .research-item, .certs");

  /* Staggered grids */
  [".stats", ".skills-grid", ".honors-grid"].forEach(function (gridSel) {
    var grid = document.querySelector(gridSel);
    if (!grid) return;
    gsap.fromTo(grid.children,
      { opacity: 0, y: 26, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.55,
        stagger: { each: 0.08, grid: "auto", from: "start" },
        ease: "power2.out",
        scrollTrigger: { trigger: grid, start: "top 85%" }
      });
  });

  /* ---------- Timelines: draw line + alternate card slide-ins ---------- */
  document.querySelectorAll("[data-timeline]").forEach(function (tl) {
    var fill = tl.querySelector(".timeline-line-fill");
    if (fill) {
      gsap.fromTo(fill, { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: tl, start: "top 75%", end: "bottom 55%", scrub: 0.8 }
      });
    }
    var mobile = window.matchMedia("(max-width: 900px)").matches;
    tl.querySelectorAll(".tl-item").forEach(function (item) {
      var side = item.getAttribute("data-side");
      var fromX = mobile ? 30 : (side === "left" ? -60 : 60);
      gsap.fromTo(item.querySelector(".tl-card"),
        { opacity: 0, x: fromX, y: 18 },
        {
          opacity: 1, x: 0, y: 0,
          duration: 0.75,
          ease: "expo.out",
          scrollTrigger: { trigger: item, start: "top 84%" }
        });
      gsap.from(item.querySelector(".tl-dot"), {
        scale: 0,
        duration: 0.5,
        ease: "back.out(2.2)",
        scrollTrigger: { trigger: item, start: "top 84%" }
      });
    });
  });

  /* ---------- Counters ---------- */
  document.querySelectorAll("[data-counter]").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-counter"));
    var obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: "expo.out",
      snap: { v: 1 },
      scrollTrigger: { trigger: el, start: "top 90%" },
      onUpdate: function () { el.textContent = Math.round(obj.v); }
    });
  });

  /* ---------- Cross-scrolling marquees (velocity-reactive) ---------- */
  document.querySelectorAll("[data-marquee]").forEach(function (mq) {
    var track = mq.querySelector(".marquee-track");
    var dir = parseInt(mq.getAttribute("data-direction"), 10) || 1;
    var tween = gsap.to(track, {
      xPercent: -50 * dir,
      duration: 22,
      ease: "none",
      repeat: -1,
      modifiers: {
        xPercent: function (x) {
          var v = parseFloat(x);
          // wrap into [-50, 0] for dir=1 and [0, 50]→[-50,0] equivalent for dir=-1
          return (dir === 1 ? (v % 50) : (v % 50) - 50) + "%";
        }
      }
    });
    if (dir === -1) gsap.set(track, { xPercent: -50 });

    // Scroll velocity boosts marquee speed for a kinetic feel
    ScrollTrigger.create({
      trigger: document.body,
      start: 0,
      end: "max",
      onUpdate: function (self) {
        var boost = 1 + Math.min(Math.abs(self.getVelocity()) / 900, 3);
        gsap.to(tween, { timeScale: boost, duration: 0.3, overwrite: true });
      }
    });
  });

  /* ---------- Nav: hide on scroll down, active link tracking ---------- */
  var nav = document.getElementById("nav");
  var lastY = 0;
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: function (self) {
      var y = self.scroll();
      if (y > 140 && y > lastY + 4) nav.classList.add("nav--hidden");
      else if (y < lastY - 4) nav.classList.remove("nav--hidden");
      lastY = y;
    }
  });

  document.querySelectorAll(".nav-links a").forEach(function (link) {
    var section = document.querySelector(link.getAttribute("href"));
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: "top 45%",
      end: "bottom 45%",
      onToggle: function (self) {
        if (self.isActive) {
          document.querySelectorAll(".nav-links a").forEach(function (a) { a.classList.remove("is-active"); });
          link.classList.add("is-active");
        } else {
          link.classList.remove("is-active");
        }
      }
    });
  });

  /* ---------- Cursor glow + card tilt (fine pointers only) ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var glow = document.querySelector(".cursor-glow");
    var setX = gsap.quickTo(glow, "left", { duration: 0.55, ease: "power3.out" });
    var setY = gsap.quickTo(glow, "top", { duration: 0.55, ease: "power3.out" });
    window.addEventListener("mousemove", function (e) { setX(e.clientX); setY(e.clientY); });

    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power2.out" });
      var ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power2.out" });
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        gsap.set(card, { transformPerspective: 900 });
        rx(-py * 5);
        ry(px * 5);
      });
      card.addEventListener("mouseleave", function () { rx(0); ry(0); });
    });
  }

  /* Recalculate positions once fonts settle */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
