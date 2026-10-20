/* ==========================================================================
   SEED website — behaviour & rendering
   Renders content from data.js into the page and wires up interactions.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- small helpers -------------------------------------------- */
  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDate(iso) {
    var parts = String(iso || "").split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return iso || "";
    var d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function dateParts(iso) {
    var parts = String(iso || "").split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return { month: "—", day: "—" };
    var d = new Date(parts[0], parts[1] - 1, parts[2]);
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }),
      day: String(parts[2]),
    };
  }

  function sortedAnnouncements() {
    return ANNOUNCEMENTS.slice().sort(function (a, b) {
      return String(b.date).localeCompare(String(a.date));
    });
  }

  /* ---------- navigation (mobile toggle) -------------------------------- */
  function initNav() {
    var toggle = q("#nav-toggle");
    var menu = q("#mobile-nav");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    qa("a", menu).forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- announcement card markup ---------------------------------- */
  function announcementCard(a) {
    var meta = "";
    meta += '<span class="badge badge--category">' + esc(a.category) + "</span>";
    if (a.sample) meta += ' <span class="badge badge--placeholder">Sample</span>';
    meta += ' <span class="card-meta__date">' + esc(formatDate(a.date)) + "</span>";

    var media = a.cover
      ? '<a class="announcement-card__media" href="announcement.html?id=' + encodeURIComponent(a.id) + '" tabindex="-1" aria-hidden="true">' +
        '<img src="' + esc(a.cover) + '" alt="" loading="lazy"></a>'
      : "";

    return (
      '<article class="announcement-card">' +
      media +
      '<div class="announcement-card__body">' +
      '<div class="card-meta">' + meta + "</div>" +
      '<h3 class="card-title"><a href="announcement.html?id=' + encodeURIComponent(a.id) + '">' + esc(a.title) + "</a></h3>" +
      '<p class="card-summary">' + esc(a.summary) + "</p>" +
      '<div class="card-footer"><a class="text-link" href="announcement.html?id=' + encodeURIComponent(a.id) + '">Read more <span aria-hidden="true">\u2192</span></a></div>' +
      "</div></article>"
    );
  }

  /* ---------- home: latest announcements -------------------------------- */
  function initHomeAnnouncements() {
    var el = q("#latest-announcements");
    if (!el) return;
    var latest = sortedAnnouncements().slice(0, 3);
    el.innerHTML = latest.map(announcementCard).join("");
  }

  /* ---------- home: upcoming events ------------------------------------- */
  function initHomeEvents() {
    var el = q("#events-container");
    if (!el) return;
    if (!EVENTS.length) {
      el.innerHTML =
        '<div class="empty-state">' +
        '<h3 class="empty-state__title">No upcoming events right now</h3>' +
        '<p class="muted">Stay tuned for updates — new meetings and campaigns will appear here.</p>' +
        "</div>";
      return;
    }
    el.innerHTML =
      '<div class="event-list">' +
      EVENTS.map(function (ev) {
        var d = dateParts(ev.date);
        var meta = esc(formatDate(ev.date));
        if (ev.time) meta += " &middot; " + esc(ev.time);
        if (ev.location) meta += " &middot; " + esc(ev.location);
        var link = ev.registerLink
          ? '<div class="mt-4"><a class="btn btn--outline btn--sm" href="' + esc(ev.registerLink) + '">Register</a></div>'
          : "";
        return (
          '<article class="event-item">' +
          '<div class="event-item__date">' +
          '<span class="event-item__date--month">' + esc(d.month) + "</span>" +
          '<span class="event-item__date--day">' + esc(d.day) + "</span>" +
          "</div>" +
          '<div class="event-item__body">' +
          '<h3>' + esc(ev.title) + "</h3>" +
          '<div class="event-item__meta">' + meta + "</div>" +
          (ev.description ? '<p class="muted">' + esc(ev.description) + "</p>" : "") +
          link +
          "</div></article>"
        );
      }).join("") +
      "</div>";
  }

  /* ---------- announcements page: filters + list ------------------------ */
  function initAnnouncementsPage() {
    var grid = q("#announcement-grid");
    if (!grid) return;

    var list = sortedAnnouncements();
    var featured = list.filter(function (a) { return a.featured; })[0];
    var rest = list.filter(function (a) { return a !== featured; });

    var categories = [];
    list.forEach(function (a) {
      if (categories.indexOf(a.category) === -1) categories.push(a.category);
    });
    categories.sort();

    var filtersEl = q("#announcement-filters");
    var chips = ["All"].concat(categories).map(function (cat) {
      return (
        '<button class="filter-chip' + (cat === "All" ? " is-active" : "") + '" type="button" data-filter="' + esc(cat) + '">' +
        esc(cat) + "</button>"
      );
    }).join("");
    filtersEl.innerHTML = chips;

    var countEl = q("#announcement-count");

    function render(filter) {
      var showFeatured = featured && (filter === "All" || featured.category === filter);
      var shown = rest.filter(function (a) { return filter === "All" || a.category === filter; });

      var html = "";
      if (showFeatured) {
        html += '<article class="announcement-card announcement-card--featured">' +
          (featured.cover
            ? '<a class="announcement-card__media" href="announcement.html?id=' + encodeURIComponent(featured.id) + '" tabindex="-1" aria-hidden="true">' +
              '<img src="' + esc(featured.cover) + '" alt="" loading="lazy"></a>'
            : "") +
          '<div class="announcement-card__body">' +
          '<div class="card-meta">' +
          '<span class="badge badge--pinned">Featured</span> ' +
          '<span class="badge badge--category">' + esc(featured.category) + "</span> " +
          '<span class="card-meta__date">' + esc(formatDate(featured.date)) + "</span>" +
          "</div>" +
          '<h2 class="card-title"><a href="announcement.html?id=' + encodeURIComponent(featured.id) + '">' + esc(featured.title) + "</a></h2>" +
          '<p class="card-summary">' + esc(featured.summary) + "</p>" +
          '<div class="card-footer"><a class="text-link" href="announcement.html?id=' + encodeURIComponent(featured.id) + '">Read the full announcement <span aria-hidden="true">\u2192</span></a></div>' +
          "</div></article>";
      }

      if (shown.length) {
        html += '<div class="card-row">' + shown.map(announcementCard).join("") + "</div>";
      } else {
        html += '<div class="empty-state">' +
          '<h3 class="empty-state__title">No announcements in this category yet</h3>' +
          '<p class="muted">Check back soon, or choose another category.</p></div>';
      }

      grid.innerHTML = html;

      if (countEl) {
        var total = (showFeatured ? 1 : 0) + shown.length;
        countEl.textContent = total + (total === 1 ? " announcement" : " announcements");
      }
    }

    qa(".filter-chip", filtersEl).forEach(function (chip) {
      chip.addEventListener("click", function () {
        qa(".filter-chip", filtersEl).forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        render(chip.getAttribute("data-filter"));
      });
    });

    render("All");
  }

  /* ---------- announcement detail page ---------------------------------- */
  function initAnnouncementDetail() {
    var el = q("#announcement-detail");
    if (!el) return;
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var item = ANNOUNCEMENTS.filter(function (a) { return a.id === id; })[0];

    if (!item) {
      el.innerHTML =
        '<div class="empty-state">' +
        '<h2 class="empty-state__title">Announcement not found</h2>' +
        '<p class="muted">This announcement may have been removed or the link is incorrect.</p>' +
        '<p class="mt-5"><a class="btn btn--primary" href="announcements.html">Back to all announcements</a></p>' +
        "</div>";
      document.title = "Announcement not found — " + SITE.name;
      return;
    }

    document.title = item.title + " — " + SITE.name;

    var content = item.content.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");

    el.innerHTML =
      '<div class="paper-panel">' +
      '<div class="card-meta" style="margin-bottom:1.25rem;">' +
      '<span class="badge badge--category">' + esc(item.category) + "</span>" +
      (item.sample ? ' <span class="badge badge--placeholder">Sample</span>' : "") +
      '<span class="card-meta__date">' + esc(formatDate(item.date)) + "</span>" +
      "</div>" +
      '<h1>' + esc(item.title) + "</h1>" +
      (item.cover
        ? '<figure class="mt-5"><img src="' + esc(item.cover) + '" alt="" style="border-radius:var(--radius-lg);" loading="lazy"></figure>'
        : "") +
      '<div class="prose mt-5">' + content + "</div>" +
      '<div class="mt-6"><a class="text-link" href="announcements.html"><span aria-hidden="true">\u2190</span> Back to all announcements</a></div>' +
      "</div>";
  }

  /* ---------- projects page --------------------------------------------- */
  function upcomingProjectCard(p) {
    var meta = '<span class="badge badge--status is-current">' + esc(p.status) + "</span>";
    if (p.lastUpdated) meta += ' <span class="card-meta__date">Updated ' + esc(formatDate(p.lastUpdated)) + "</span>";

    var footer = p.detailPage
      ? '<div class="card-footer"><a class="btn btn--outline btn--sm" href="' + esc(p.detailPage) + '">View project</a></div>'
      : "";

    return (
      '<article class="project-card project-card--featured">' +
      '<div class="project-card__media"><img src="' + esc(p.image) + '" alt="" loading="lazy"></div>' +
      '<div class="project-card__body">' +
      '<div class="card-meta">' + meta + "</div>" +
      '<span class="project-card__number">Project ' + esc(p.projectNumber) + "</span>" +
      '<h2 class="card-title">' + esc(p.name) + "</h2>" +
      (p.tagline ? '<p class="card-summary" style="color:var(--forest);font-weight:500;">' + esc(p.tagline) + "</p>" : "") +
      '<p class="card-summary">' + esc(p.description) + "</p>" +
      footer +
      "</div></article>"
    );
  }

  function pastProjectCard(p) {
    var meta = '<span class="badge badge--status">Completed</span>';
    if (p.completionDate) meta += ' <span class="card-meta__date">' + esc(formatDate(p.completionDate)) + "</span>";

    var footer = p.detailPage
      ? '<div class="card-footer"><a class="btn btn--outline btn--sm" href="' + esc(p.detailPage) + '">View report</a></div>'
      : "";

    return (
      '<article class="project-card">' +
      '<div class="project-card__media"><img src="' + esc(p.image) + '" alt="" loading="lazy"></div>' +
      '<div class="project-card__body">' +
      '<div class="card-meta">' + meta + "</div>" +
      '<span class="project-card__number">Project ' + esc(p.projectNumber) + "</span>" +
      '<h3 class="card-title">' + esc(p.name) + "</h3>" +
      '<p class="card-summary">' + esc(p.description) + "</p>" +
      (p.outcomes ? '<p class="card-summary">' + esc(p.outcomes) + "</p>" : "") +
      footer +
      "</div></article>"
    );
  }

  function initProjectsPage() {
    var tabs = q("#liquid-tabs");
    if (!tabs) return;

    var glass = q("#liquid-glass", tabs);
    var buttons = qa(".liquid-tab", tabs);
    var panelUpcoming = q("#panel-upcoming");
    var panelPast = q("#panel-past");
    if (!glass || buttons.length < 2) return;

    var selectedIndex = 0;
    var targets = [];
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* Populate the two content panels from PROJECTS data (data-driven). */
    function populatePanels() {
      var upcoming = PROJECTS.filter(function (p) { return p.category === "upcoming"; });
      var past = PROJECTS.filter(function (p) { return p.category === "past"; });

      if (panelUpcoming) {
        panelUpcoming.innerHTML = upcoming.length
          ? '<div class="project-stack">' + upcoming.map(upcomingProjectCard).join("") + "</div>"
          : '<div class="empty-state"><h3 class="empty-state__title">No upcoming projects right now</h3><p class="muted">New initiatives will appear here as they begin.</p></div>';
      }
      if (panelPast) {
        panelPast.innerHTML = past.length
          ? '<div class="grid-2">' + past.map(pastProjectCard).join("") + "</div>"
          : '<div class="empty-state"><h3 class="empty-state__title">Our sustainability journey is just beginning</h3><p class="muted">Completed projects and their impact will be documented here as SEED grows.</p></div>';
      }
    }

    /* Measure real button positions so the effect stays responsive. */
    function measureGeometry() {
      var rootRect = tabs.getBoundingClientRect();
      var originX = rootRect.left + tabs.clientLeft;
      var originY = rootRect.top + tabs.clientTop;
      var rects = buttons.map(function (b) { return b.getBoundingClientRect(); });

      targets = rects.map(function (r) {
        return { x: r.left - originX, y: r.top - originY, width: r.width, height: r.height };
      });

      var first = rects[0];
      var second = rects[1];
      var gap = second.left - first.right;
      var lensWidth = second.right - first.left;

      glass.style.width = first.width + "px";
      glass.style.height = first.height + "px";
      glass.style.top = targets[0].y + "px";

      tabs.style.setProperty("--base-x", targets[0].x + "px");
      tabs.style.setProperty("--lens-width", lensWidth + "px");
      tabs.style.setProperty("--lens-col-1", first.width + "px");
      tabs.style.setProperty("--lens-col-2", second.width + "px");
      tabs.style.setProperty("--lens-gap", gap + "px");

      moveGlass(targets[selectedIndex].x, true);
    }

    /* Only move to a selected segment */
    function moveGlass(x, instant) {
      if (instant || reducedMotion.matches) {
        var previousTransition = glass.style.transition;
        glass.style.transition = "none";
        tabs.style.setProperty("--glass-x", x + "px");
        /* Apply the new position before restoring animation */
        glass.getBoundingClientRect();
        glass.style.transition = previousTransition;
        return;
      }
      tabs.style.setProperty("--glass-x", x + "px");
    }

    function selectTab(index) {
      selectedIndex = index;
      buttons.forEach(function (btn, i) {
        var selected = i === index;
        btn.classList.toggle("is-selected", selected);
        btn.setAttribute("aria-selected", String(selected));
        btn.tabIndex = selected ? 0 : -1;
      });
      [panelUpcoming, panelPast].forEach(function (panel, i) {
        if (panel) panel.hidden = i !== index;
      });
      if (targets[index]) {
        moveGlass(targets[index].x);
      }
    }

    buttons.forEach(function (btn, index) {
      btn.addEventListener("click", function () { selectTab(index); });
      btn.addEventListener("keydown", function (e) {
        var nextIndex = selectedIndex;
        if (e.key === "ArrowRight") nextIndex = Math.min(buttons.length - 1, index + 1);
        else if (e.key === "ArrowLeft") nextIndex = Math.max(0, index - 1);
        else if (e.key === "Home") nextIndex = 0;
        else if (e.key === "End") nextIndex = buttons.length - 1;
        else return;
        e.preventDefault();
        selectTab(nextIndex);
        buttons[nextIndex].focus();
      });
    });

    /* Re-measure when the layout changes. */
    window.addEventListener("resize", measureGeometry);
    if ("ResizeObserver" in window) {
      new ResizeObserver(measureGeometry).observe(tabs);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureGeometry);
    }

    populatePanels();
    measureGeometry();
  }

  /* ---------- GreenBox detail page -------------------------------------- */
  function initGreenBoxPage() {
    if (!q("#greenbox-status")) return;
    var g = GREENBOX;

    // Header facts
    q("#greenbox-status").innerHTML = '<span class="badge badge--status is-current">' + esc(g.status) + "</span>";
    q("#greenbox-initiated").textContent = g.initiated;
    q("#greenbox-updated").textContent = g.lastUpdated;

    // Team
    var teamEl = q("#greenbox-team");
    if (teamEl) {
      if (g.PUBLISH_TEAM_NAMES) {
        teamEl.innerHTML = '<strong>' + esc(g.teamNames.join(", ")) + "</strong>";
      } else {
        teamEl.innerHTML = '<strong>' + esc(g.teamPlaceholder) + "</strong>";
      }
    }

    // Overview & problem prose
    var ovEl = q("#greenbox-overview");
    if (ovEl) ovEl.innerHTML = g.overview.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var prEl = q("#greenbox-problem");
    if (prEl) prEl.innerHTML = g.problem.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var solIntroEl = q("#greenbox-solutions-intro");
    if (solIntroEl) solIntroEl.textContent = g.solutionsIntro;

    // Survey numbers
    q("#greenbox-responses").textContent = g.survey.totalResponses;
    q("#greenbox-high").textContent = g.survey.highSchool;
    q("#greenbox-middle").textContent = g.survey.middleSchool;
    q("#greenbox-survey-window").textContent = g.survey.window;
    q("#greenbox-survey-note").textContent = g.survey.note;

    // Findings table
    var tableEl = q("#greenbox-findings-table");
    if (tableEl) {
      tableEl.innerHTML =
        "<thead><tr><th>Survey measure</th><th class='num'>Overall</th><th class='num'>High school</th><th class='num'>Middle school</th></tr></thead>" +
        "<tbody>" +
        g.survey.table.map(function (row) {
          return (
            "<tr><td>" + esc(row.measure) + "</td>" +
            "<td class='num'>" + esc(row.overall) + "</td>" +
            "<td class='num'>" + esc(row.high) + "</td>" +
            "<td class='num'>" + esc(row.middle) + "</td></tr>"
          );
        }).join("") +
        "</tbody>";
    }

    // Observations
    var obsEl = q("#greenbox-observations");
    if (obsEl) {
      obsEl.innerHTML = "<ul>" + g.survey.observations.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul>";
    }

    // Chart
    var chartEl = q("#greenbox-chart");
    if (chartEl) {
      var max = Math.max.apply(null, g.survey.chart.data.map(function (d) { return d.value; }));
      chartEl.innerHTML = g.survey.chart.data.map(function (d) {
        var pct = Math.round((d.value / max) * 100);
        return (
          '<div class="chart-row">' +
          '<span class="chart-row__label">' + esc(d.name) + "</span>" +
          '<div class="chart-row__track"><div class="chart-row__bar" style="width:' + pct + '%;"></div></div>' +
          '<span class="chart-row__value">' + esc(d.value.toFixed(2)) + "</span>" +
          "</div>"
        );
      }).join("");
    }

    // Solutions
    var solEl = q("#greenbox-solutions");
    if (solEl) {
      solEl.innerHTML = g.solutions.map(function (s) {
        var items = s.body.map(function (b, i) {
          return b.indexOf("—") === 0 ? "<li>" + esc(b) + "</li>" : "<p>" + esc(b) + "</p>";
        }).join("");
        return (
          '<article class="principle-item">' +
          '<div class="principle-item__mark">' + esc(s.letter) + "</div>" +
          '<div class="card-meta"><span class="badge badge--category">' + esc(s.status) + "</span></div>" +
          '<h3 class="mt-4">' + esc(s.title) + "</h3>" +
          '<div class="prose mt-4">' + items + "</div>" +
          '<p class="mt-4" style="font-size:0.88rem;"><em>' + esc(s.note) + "</em></p>" +
          "</article>"
        );
      }).join("");
    }

    // Timeline
    var timelineEl = q("#greenbox-timeline");
    if (timelineEl) {
      timelineEl.innerHTML = '<div class="timeline">' + g.phases.map(function (p) {
        return (
          '<article class="timeline-item is-' + esc(p.state) + '">' +
          '<div class="timeline-item__dot"></div>' +
          '<div>' +
          '<div class="timeline-item__title">' +
          '<h3>' + esc(p.key) + " \u2014 " + esc(p.title) + "</h3>" +
          '<span class="badge badge--status' + (p.state === "current" ? " is-current" : "") + '">' + esc(p.statusLabel) + "</span>" +
          "</div>" +
          '<div class="timeline-item__body"><p class="muted">' + esc(p.body) + "</p></div>" +
          "</div></article>"
        );
      }).join("") + "</div>";
    }
  }

  /* ---------- get involved page ----------------------------------------- */
  function initGetInvolved() {
    var list = q("#contact-list");
    if (!list) return;

    var valueOrPlaceholder = function (value, placeholder) {
      return value ? esc(value) : '<span class="placeholder-mark">' + esc(placeholder) + "</span>";
    };

    var rows = [];

    rows.push(
      '<div class="contact-item">' +
      '<div class="contact-item__icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></div>' +
      '<div><div class="contact-item__label">Email</div><div class="contact-item__value">' +
      (CONTACT.email
        ? '<a href="mailto:' + esc(CONTACT.email) + '">' + esc(CONTACT.email) + "</a>"
        : valueOrPlaceholder(null, "[add your club email]")) +
      "</div></div></div>"
    );

    rows.push(
      '<div class="contact-item">' +
      '<div class="contact-item__icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg></div>' +
      '<div><div class="contact-item__label">Social</div><div class="contact-item__value">' +
      (CONTACT.instagram
        ? '<a href="https://instagram.com/' + esc(CONTACT.instagram) + '">@' + esc(CONTACT.instagram) + "</a>"
        : valueOrPlaceholder(null, "[add your Instagram handle]")) +
      "</div></div></div>"
    );

    var formValue = CONTACT.interestFormUrl
      ? '<a href="' + esc(CONTACT.interestFormUrl) + '">Open interest form</a>'
      : valueOrPlaceholder(null, "[add your membership / interest form link]");
    rows.push(
      '<div class="contact-item">' +
      '<div class="contact-item__icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 12h6M9 16h6M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/></svg></div>' +
      '<div><div class="contact-item__label">Join / interest form</div><div class="contact-item__value">' + formValue + "</div></div></div>"
    );

    var regValue = CONTACT.eventRegisterUrl
      ? '<a href="' + esc(CONTACT.eventRegisterUrl) + '">Open event registration</a>'
      : valueOrPlaceholder(null, "[add your event registration link]");
    rows.push(
      '<div class="contact-item">' +
      '<div class="contact-item__icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="15" rx="2"/><path d="M8 3v3M16 3v3M3 10h18"/></svg></div>' +
      '<div><div class="contact-item__label">Event registration</div><div class="contact-item__value">' + regValue + "</div></div></div>"
    );

    list.innerHTML = rows.join("");
  }

  /* ---------- hero blooming dot matrix (canvas) -------------------------- */
  function initBloomHero() {
    var hero = q(".hero");
    if (!hero) return;
    var canvas = q("#hero-dots", hero);
    if (!canvas) return;
    var ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    var SPACING = 18;
    var INFLUENCE_RADIUS = 136;

    // Slower = a more visible unfolding process.
    var OPEN_TIME = 130;
    var CLOSE_TIME = 420;

    var width = 0;
    var height = 0;
    var dpr = 1;
    var lastTime = 0;
    var flowers = [];

    var pointer = { x: -10000, y: -10000, active: false };

    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }

    function smoothstep(a, b, v) {
      var t = clamp((v - a) / (b - a), 0, 1);
      return t * t * (3 - 2 * t);
    }

    function resize() {
      var rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      flowers = [];
      for (var y = SPACING / 2; y < height; y += SPACING) {
        for (var x = SPACING / 2; x < width; x += SPACING) {
          flowers.push({
            x: x,
            y: y,
            bloom: 0,
            // Stable orientation variation. Never randomized per frame.
            rotation: Math.sin(x * 0.017 + y * 0.023) * 0.22
          });
        }
      }

      if (reduced.matches) draw(16);
    }

    /* REST STATE — every grid point is an individual tiny bud. */
    function drawBud() {
      ctx.beginPath();
      ctx.arc(0, 0, 1.05, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(190, 218, 181, 0.66)";
      ctx.fill();
    }

    /* ONE FLOWER — larger, rounder petals; three flowering stages. */
    function drawFlower(progress, rotation) {
      var p = Math.max(0, Math.min(1, progress));
      rotation = rotation || 0;

      function smooth(a, b, x) {
        var t = Math.max(0, Math.min(1, (x - a) / (b - a)));
        return t * t * (3 - 2 * t);
      }

      // Three independent stages of flowering.
      var grow = smooth(0.04, 0.95, p);
      var spread = smooth(0.20, 0.98, p);
      var petalOpacity = smooth(0.12, 0.52, p);

      // Larger, rounder petals — not thin snowflake arms.
      var petalLength = 1.2 + 5.5 * grow;
      var petalWidth = 0.55 + 2.05 * smooth(0.30, 0.92, p);

      ctx.save();
      ctx.rotate(rotation);

      // Stage 1: a small, closed flower bud.
      var budOpacity = 1 - smooth(0.12, 0.48, p);
      if (budOpacity > 0.01) {
        ctx.save();
        ctx.globalAlpha = budOpacity;

        var budGradient = ctx.createLinearGradient(0, -2, 0, 2);
        budGradient.addColorStop(0, "#E0EDCC");
        budGradient.addColorStop(1, "#7FA77C");

        ctx.beginPath();
        ctx.ellipse(0, 0, 1.05, 1.65, 0, 0, Math.PI * 2);
        ctx.fillStyle = budGradient;
        ctx.fill();

        ctx.restore();
      }

      // Stage 2: five petals gradually unfold from the same center.
      var petalCount = 5;
      for (var i = 0; i < petalCount; i++) {
        ctx.save();

        // When closed, petals overlap into one bud; they fan out as it opens.
        var angle = (i * Math.PI * 2 / petalCount) * spread;
        ctx.rotate(angle);

        ctx.globalAlpha = petalOpacity;

        var petalGradient = ctx.createLinearGradient(0, -petalLength, 0, 1);
        petalGradient.addColorStop(0, "#E6F0D3");
        petalGradient.addColorStop(0.58, "#C1DDB5");
        petalGradient.addColorStop(1, "#86AD83");

        // Pointed petal with a sharp tip and narrow base.
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // Left side: curve outward, then narrow to a sharp tip.
        ctx.bezierCurveTo(
          -petalWidth * 0.25, -petalLength * 0.18,
          -petalWidth * 0.95, -petalLength * 0.65,
          0, -petalLength
        );
        // Right side: mirror the curve back to the pointed base.
        ctx.bezierCurveTo(
          petalWidth * 0.95, -petalLength * 0.65,
          petalWidth * 0.25, -petalLength * 0.18,
          0, 0
        );
        ctx.closePath();
        ctx.fillStyle = petalGradient;
        ctx.fill();

        ctx.restore();
      }

      // Stage 3: a warm flower center appears as the petals open.
      var centerOpacity = smooth(0.42, 0.82, p);
      if (centerOpacity > 0.01) {
        ctx.save();
        ctx.globalAlpha = centerOpacity;
        ctx.beginPath();
        ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "#F2E6AC";
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }

    function draw(deltaTime) {
      ctx.clearRect(0, 0, width, height);
      var dt = Math.min(deltaTime, 40);

      for (var i = 0; i < flowers.length; i++) {
        var f = flowers[i];
        var dx = f.x - pointer.x;
        var dy = f.y - pointer.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        // Each dot calculates its own opening amount (no cursor-centered flower).
        var target = pointer.active
          ? 1 - smoothstep(8, INFLUENCE_RADIUS, distance)
          : 0;

        if (reduced.matches) {
          f.bloom = target;
        } else {
          var timeConstant = target > f.bloom ? OPEN_TIME : CLOSE_TIME;
          var amount = 1 - Math.exp(-dt / timeConstant);
          f.bloom += (target - f.bloom) * amount;
        }

        ctx.save();
        ctx.translate(f.x, f.y);
        // Original dot remains at its fixed home position.
        drawBud();
        if (f.bloom > 0.005) drawFlower(f.bloom, f.rotation);
        ctx.restore();
      }
    }

    function animate(time) {
      var dt = lastTime ? time - lastTime : 16;
      lastTime = time;
      draw(dt);
      requestAnimationFrame(animate);
    }

    function updatePointer(event) {
      var rect = hero.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    }

    hero.addEventListener("pointerenter", function (event) {
      if (event.pointerType === "touch") return;
      updatePointer(event);
    });
    hero.addEventListener("pointermove", function (event) {
      if (event.pointerType === "touch") return;
      updatePointer(event);
    });
    hero.addEventListener("pointerleave", function (event) {
      if (event.pointerType === "touch") return;
      pointer.active = false;
    });
    hero.addEventListener("pointerdown", function (event) {
      if (event.pointerType !== "touch") return;
      updatePointer(event);
    });
    hero.addEventListener("pointerup", function (event) {
      if (event.pointerType === "touch") pointer.active = false;
    });
    hero.addEventListener("pointercancel", function () {
      pointer.active = false;
    });

    if ("ResizeObserver" in window) {
      new ResizeObserver(resize).observe(hero);
    } else {
      window.addEventListener("resize", resize);
    }

    resize();
    requestAnimationFrame(animate);
  }

  /* ---------- boot ------------------------------------------------------ */
  function init() {
    initNav();
    initBloomHero();
    initHomeAnnouncements();
    initHomeEvents();
    initAnnouncementsPage();
    initAnnouncementDetail();
    initProjectsPage();
    initGreenBoxPage();
    initGetInvolved();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();