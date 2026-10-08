const data = window.portfolioData;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function setText(selector, value) {
  $$(selector).forEach((element) => {
    element.textContent = value;
  });
}

function setHTML(selector, value) {
  const element = $(selector);
  if (element) element.innerHTML = value;
}

function renderPerson() {
  setText("[data-full-name]", data.person.fullName);
  setText("[data-first-name]", data.person.firstName);
  setText("[data-short-name]", data.person.shortName);
  setText("[data-location]", data.person.location);
  setText("[data-discipline]", data.person.discipline);
  setText("[data-focus]", data.person.focus);
  setText("[data-status]", data.person.availability);
  setText("[data-terminal-name]", data.person.terminalName);
  setHTML("[data-hero-heading]", data.hero.heading);
  setText("[data-hero-intro]", data.hero.intro);
  document.title = `${data.person.fullName} — Portfolio`;
}

function renderAbout() {
  setText("[data-about-lead]", data.about.lead);
  setText("[data-about-body]", data.about.body);
  $("[data-profile-facts]").innerHTML = data.about.facts
    .map(
      (fact) => `
        <div>
          <dt>${fact.label}</dt>
          <dd>${fact.value}</dd>
        </div>`,
    )
    .join("");
}

function renderCTFs() {
  $("[data-ctf-stats]").innerHTML = data.ctfStats
    .map(
      (stat) => `
        <div class="ctf-stat">
          <strong>${stat.value}</strong>
          <span>${stat.label}</span>
        </div>`,
    )
    .join("");

  const renderRow = ({ ctf, index, displayIndex }) => {
      const image = ctf.images[0];
      const thumbnail = image
        ? `<div class="ctf-thumb image-slot" data-src="assets/images/${image}" data-event-index="${index}" data-label="${ctf.event} photos"><span>CTF ${String(displayIndex).padStart(2, "0")}</span></div>`
        : `<div class="ctf-thumb ctf-thumb--empty" aria-hidden="true"><span>CTF ${String(displayIndex).padStart(2, "0")}</span></div>`;
      return `
        <article class="ctf-row reveal">
          <span class="ctf-index">${String(displayIndex).padStart(2, "0")}</span>
          ${thumbnail}
          <div class="ctf-main">
            <time>${ctf.date}</time>
            <h3>${ctf.event}</h3>
            <p>${ctf.team} <span aria-hidden="true">·</span> ${ctf.format}</p>
            ${image ? `<button type="button" class="ctf-gallery-trigger" data-gallery-event="${index}">View ${ctf.images.length === 1 ? "photo" : `${ctf.images.length} photos`} ↗</button>` : ""}
          </div>
          <div class="ctf-placement">
            <span>Result</span>
            <strong>${ctf.placement}</strong>
          </div>
        </article>`;
  };
  const entries = data.ctfs.map((ctf, index) => ({ ctf, index }));
  const featured = entries.filter(({ ctf }) => ctf.featured).map((entry, index) => ({ ...entry, displayIndex: index + 1 }));
  const archive = entries.filter(({ ctf }) => !ctf.featured).map((entry, index) => ({ ...entry, displayIndex: featured.length + index + 1 }));
  $("[data-ctfs]").innerHTML = `
    <div class="ctf-group-label"><span>Selected results</span><span>Top five placements</span></div>
    ${featured.map(renderRow).join("")}
    <details class="ctf-archive">
      <summary><span>Explore the wider CTF record</span><small>${archive.length} more competitions</small><span class="ctf-archive-icon" aria-hidden="true">+</span></summary>
      <div class="ctf-archive-content">${archive.map(renderRow).join("")}</div>
    </details>`;
}

function renderExperience() {
  const featured = data.experience[0];
  setText("[data-experience-feature]", `${featured.role} / ${featured.organisation}`);
  $("[data-experience]").innerHTML = data.experience
    .map(
      (item) => `
        <article class="timeline-item reveal">
          <time>${item.period}</time>
          <h3>${item.role}</h3>
          <p class="organisation">${item.organisation}</p>
          <p class="description">${item.description}</p>
          <div class="tags">${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        </article>`,
    )
    .join("");
}

function renderCredentials() {
  $("[data-credentials]").innerHTML = data.credentials
    .map(
      (credential) => `
        <article class="credential-card credential-card--text reveal">
          <div class="credential-issuer">${credential.issuer}</div>
          <div class="credential-body">
            <div class="card-meta"><span>${credential.date}</span></div>
            <h3>${credential.title}</h3>
            <p>${credential.description}</p>
          </div>
        </article>`,
    )
    .join("");
}

function renderEducation() {
  const education = data.education;
  $("[data-education-summary]").innerHTML = `
    <time>${education.period}</time>
    <h3>${education.degree}</h3>
    <p class="institution">${education.institution}</p>
    <p>${education.description}</p>`;

  $("[data-modules]").innerHTML = education.modules
    .map(
      (module, index) => `
        <div class="module">
          <button type="button" aria-expanded="false">
            <span class="module-number">${String(index + 1).padStart(2, "0")}</span>
            <span class="module-title">${module.title}</span>
            <span class="module-icon" aria-hidden="true">+</span>
          </button>
          <div class="module-detail"><div><p>${module.detail}</p></div></div>
        </div>`,
    )
    .join("");
}

function renderContact() {
  setText("[data-contact-copy]", data.contact.copy);
  $("[data-contact-links]").innerHTML = data.contact.links
    .map((link) => {
      const external = link.url.startsWith("http");
      return `<a class="contact-link" href="${link.url}"${external ? ' target="_blank" rel="noreferrer"' : ""}>
        <span>${link.label}</span><span>${link.value} ↗</span>
      </a>`;
    })
    .join("");
}

function loadOptionalImages() {
  const slots = $$(".image-slot");
  slots.forEach((slot) => {
    const key = slot.dataset.imageKey;
    const source = slot.dataset.src || data.images[key];
    if (!source) return;

    const image = new Image();
    image.onload = () => {
      slot.style.backgroundImage = `linear-gradient(to top, rgba(15, 36, 76, .14), transparent 48%), url("${source}")`;
      slot.classList.add("has-image");
      slot.setAttribute("role", "button");
      slot.setAttribute("tabindex", "0");
      slot.setAttribute("aria-label", `Open image: ${slot.dataset.label}`);
      slot.dataset.loadedSrc = source;
    };
    image.src = source;
  });
}

function initNavigation() {
  const toggle = $(".menu-toggle");
  const nav = $(".primary-nav");

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });

  $$(".primary-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    });
  });

  const sections = $$('main section[id]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$(".primary-nav a").forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -58%", threshold: 0 },
  );
  sections.forEach((section) => observer.observe(section));
}

function initAccordions() {
  $$(".module button").forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
    });
  });
}

function initReveal() {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  $$(".reveal").forEach((element) => revealObserver.observe(element));
}

function initImageModal() {
  const modal = $(".image-modal");
  const modalImage = $("img", modal);
  const modalCaption = $("p", modal);
  const modalCount = $(".modal-count", modal);
  const previous = $(".modal-prev", modal);
  const next = $(".modal-next", modal);
  let activeImages = [];
  let activeIndex = 0;

  function showImage() {
    const current = activeImages[activeIndex];
    modalImage.src = current.src;
    modalImage.alt = current.label;
    modalCaption.textContent = current.label;
    modalCount.textContent = `${activeIndex + 1} / ${activeImages.length}`;
    previous.hidden = activeImages.length < 2;
    next.hidden = activeImages.length < 2;
  }

  function openGallery(eventIndex) {
    const ctf = data.ctfs[eventIndex];
    if (!ctf?.images.length) return;
    activeImages = ctf.images.map((filename) => ({
      src: `assets/images/${filename}`,
      label: `${ctf.event} · ${filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")}`,
    }));
    activeIndex = 0;
    showImage();
    modal.showModal();
  }

  function openModal(slot) {
    if (!slot.dataset.loadedSrc) return;
    if (slot.dataset.eventIndex !== undefined) {
      openGallery(Number(slot.dataset.eventIndex));
      return;
    }
    activeImages = [{ src: slot.dataset.loadedSrc, label: slot.dataset.label }];
    activeIndex = 0;
    showImage();
    modal.showModal();
  }

  document.addEventListener("click", (event) => {
    const galleryButton = event.target.closest("[data-gallery-event]");
    if (galleryButton) {
      openGallery(Number(galleryButton.dataset.galleryEvent));
      return;
    }
    const slot = event.target.closest(".image-slot.has-image");
    if (slot) openModal(slot);
  });

  document.addEventListener("keydown", (event) => {
    const slot = event.target.closest?.(".image-slot.has-image");
    if (slot && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openModal(slot);
    }
  });

  $(".modal-close").addEventListener("click", () => modal.close());
  previous.addEventListener("click", () => {
    activeIndex = (activeIndex - 1 + activeImages.length) % activeImages.length;
    showImage();
  });
  next.addEventListener("click", () => {
    activeIndex = (activeIndex + 1) % activeImages.length;
    showImage();
  });
  modal.addEventListener("keydown", (event) => {
    if (activeImages.length < 2) return;
    if (event.key === "ArrowLeft") previous.click();
    if (event.key === "ArrowRight") next.click();
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
}

renderPerson();
renderAbout();
renderCTFs();
renderExperience();
renderCredentials();
renderEducation();
renderContact();
setText("[data-year]", new Date().getFullYear());

loadOptionalImages();
initNavigation();
initAccordions();
initReveal();
initImageModal();
