// Panduan NikahKit: one guide page at a time (#/path), search over titles and text, tabs. Without JS all pages show.
(function () {
  var root = document.getElementById("pd"), docs = [].slice.call(root.querySelectorAll(".doc"));
  var links = [].slice.call(root.querySelectorAll(".pd-nav a")), toc = root.querySelector(".pd-toc");
  var q = document.getElementById("pdQ"), hits = document.getElementById("pdHits");
  var narrow = window.matchMedia("(max-width:900px)");
  root.classList.add("js");
  if (narrow.matches) toc.open = false;
  function show() {
    var p = decodeURIComponent(location.hash.replace(/^#\/?/, "")).replace(/\/$/, "");
    var doc = docs.filter(function (d) { return d.getAttribute("data-p") === p; })[0] || docs[0];
    docs.forEach(function (d) { d.classList.toggle("on", d === doc); });
    links.forEach(function (a) { if (a.getAttribute("data-p") === doc.getAttribute("data-p")) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    document.title = doc.querySelector("h1").textContent + " · Panduan NikahKit";
    if (narrow.matches) toc.open = false;
    var target = pending && document.getElementById(pending); pending = null;
    if (target && doc.contains(target)) { target.scrollIntoView(); return; }
    window.scrollTo(0, 0);
    var h = doc.querySelector("h1"); h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true });
  }
  // Links to a heading carry data-a (the heading id); the hash stays #/path so the router keeps working.
  var pending = null;
  root.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-a]");
    if (!a) return;
    pending = a.getAttribute("data-a");
    if (a.getAttribute("href") === location.hash) { e.preventDefault(); show(); }
  });
  window.addEventListener("hashchange", show);
  show();
  // Search: every term must appear in the page title or text; title hits first.
  var index = docs.map(function (d) { return { p: d.getAttribute("data-p"), t: d.querySelector("h1").textContent, g: d.querySelector(".crumb").textContent, x: d.textContent.toLowerCase() }; });
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; }); }
  q.addEventListener("input", function () {
    var terms = q.value.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) { hits.hidden = true; hits.innerHTML = ""; return; }
    var found = index.filter(function (e) { return terms.every(function (t) { return e.x.indexOf(t) >= 0; }); })
      .sort(function (a, b) { return (terms.some(function (t) { return b.t.toLowerCase().indexOf(t) >= 0; }) ? 1 : 0) - (terms.some(function (t) { return a.t.toLowerCase().indexOf(t) >= 0; }) ? 1 : 0); });
    hits.hidden = false;
    hits.innerHTML = found.length ? found.slice(0, 12).map(function (e) { return '<a href="#/' + esc(e.p) + '">' + esc(e.t) + "<small>" + esc(e.g) + "</small></a>"; }).join("") : "<p>Tidak ada hasil. Coba kata lain.</p>";
  });
  // Tabs: arrow keys move between tabs.
  [].slice.call(root.querySelectorAll("[data-tabs]")).forEach(function (box) {
    var tabs = [].slice.call(box.querySelectorAll('[role="tab"]'));
    function pick(i) { tabs.forEach(function (t, j) { t.setAttribute("aria-selected", String(i === j)); t.tabIndex = i === j ? 0 : -1; document.getElementById(t.getAttribute("aria-controls")).hidden = i !== j; }); }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { pick(i); });
      t.addEventListener("keydown", function (e) { var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (k) { e.preventDefault(); var n = (i + k + tabs.length) % tabs.length; pick(n); tabs[n].focus(); } });
    });
    pick(0);
  });
})();
