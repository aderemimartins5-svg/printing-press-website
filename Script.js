
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "2348156569027"; // change to the real business number

  /* sticky nav shadow */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    nav.classList.toggle("is-stuck", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* mobile menu */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  var closeMenu = function () {
    nav.classList.remove("is-open");
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* active link highlighting */
  var sections = ["top", "about", "services", "work", "process", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });

    /* scroll reveal */
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 70 + "ms";
      revealer.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* portfolio filters */
  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter"));
  var tiles = Array.prototype.slice.call(document.querySelectorAll(".tile"));
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.dataset.filter;
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      tiles.forEach(function (tile) {
        tile.classList.toggle("is-hidden", cat !== "all" && tile.dataset.cat !== cat);
      });
    });
  });

  /* file input label */
  var fileInput = document.getElementById("design");
  var fileLabel = document.getElementById("fileLabel");
  fileInput.addEventListener("change", function () {
    fileLabel.textContent = fileInput.files.length ? fileInput.files[0].name : "Choose a file";
  });

  /* quote form -> WhatsApp handoff */
  var form = document.getElementById("quoteForm");
  var note = document.getElementById("formNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var required = ["name", "email", "phone", "service", "details"];
    var missing = required.filter(function (id) { return !document.getElementById(id).value.trim(); });
    if (missing.length) {
      note.textContent = "Fill in your name, email, phone, service and project details before sending.";
      note.style.color = "#B3261E";
      document.getElementById(missing[0]).focus();
      return;
    }
    var msg =
      "New quote request from the OceanGraphics website\n\n" +
      "Name: " + document.getElementById("name").value.trim() + "\n" +
      "Email: " + document.getElementById("email").value.trim() + "\n" +
      "Phone: " + document.getElementById("phone").value.trim() + "\n" +
      "Service: " + document.getElementById("service").value + "\n" +
      "Details: " + document.getElementById("details").value.trim() +
      (fileInput.files.length ? "\n\nFile to send: " + fileInput.files[0].name : "");
    window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    note.style.color = "";
    note.textContent = "Request opened in WhatsApp — attach your design file there and send.";
  });
})();
