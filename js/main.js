/* ============================================================
   Horizon Immobilier — scripts
   Pour ajouter / modifier un bien, éditez simplement le tableau
   PROPERTIES ci-dessous.
   ============================================================ */

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=75`;

const PROPERTIES = [
  {
    id: 1, type: "maison", transaction: "vente", price: 685000,
    title: "Villa contemporaine avec piscine", location: "Mérignac",
    surface: 165, rooms: 6, bedrooms: 4,
    image: img("1600585154340-be6161a56a0c"),
    description: "Villa d'architecte lumineuse sur un terrain arboré de 900 m². Grand séjour ouvert sur terrasse, cuisine équipée, suite parentale et piscine chauffée.",
    features: ["Piscine", "Garage double", "Terrain 900 m²", "DPE B"],
  },
  {
    id: 2, type: "appartement", transaction: "vente", price: 412000,
    title: "Appartement haussmannien", location: "Bordeaux — Chartrons",
    surface: 92, rooms: 4, bedrooms: 2,
    image: img("1502672260266-1c1ef2d93688"),
    description: "Au 2ᵉ étage d'un bel immeuble en pierre, parquet, moulures et cheminées d'origine. Balcon filant avec vue dégagée sur les quais.",
    features: ["Balcon", "Cave", "Parquet ancien", "DPE D"],
  },
  {
    id: 3, type: "appartement", transaction: "location", price: 1150,
    title: "T2 meublé refait à neuf", location: "Bordeaux — Saint-Michel",
    surface: 48, rooms: 2, bedrooms: 1,
    image: img("1522708323590-d24dbb6b0267"),
    description: "Appartement entièrement rénové et meublé avec goût, à deux pas du tram. Idéal jeune actif. Disponible immédiatement.",
    features: ["Meublé", "Proche tram", "Charges incluses", "DPE C"],
  },
  {
    id: 4, type: "maison", transaction: "vente", price: 349000,
    title: "Échoppe bordelaise avec jardin", location: "Talence",
    surface: 105, rooms: 5, bedrooms: 3,
    image: img("1570129477492-45c003edd2be"),
    description: "Charmante échoppe en pierre de taille, jardin sud de 120 m² sans vis-à-vis. Quartier calme, écoles et commerces à pied.",
    features: ["Jardin sud", "Pierre de taille", "Proche écoles", "DPE C"],
  },
  {
    id: 5, type: "terrain", transaction: "vente", price: 189000,
    title: "Terrain constructible viabilisé", location: "Saint-Médard-en-Jalles",
    surface: 750, rooms: 0, bedrooms: 0,
    image: img("1500382017468-9049fed747ef"),
    description: "Beau terrain plat, viabilisé et hors lotissement. Libre de constructeur. Environnement boisé, à 20 minutes du centre de Bordeaux.",
    features: ["Viabilisé", "Libre constructeur", "Plat", "Hors lotissement"],
  },
  {
    id: 6, type: "maison", transaction: "location", price: 2100,
    title: "Maison familiale avec terrasse", location: "Pessac",
    surface: 130, rooms: 5, bedrooms: 4,
    image: img("1564013799919-ab600027ffc6"),
    description: "Maison récente de plain-pied, grande pièce de vie, quatre chambres et terrasse couverte. Garage et jardin entretenu.",
    features: ["Plain-pied", "Garage", "Terrasse couverte", "DPE B"],
  },
];

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const formatPrice = (p) => euro.format(p.price) + (p.transaction === "location" ? " /mois" : "");

/* ---------- Navigation ---------- */
const nav = $("#nav");
const burger = $("#burger");
const navLinks = $("#navLinks");

const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const toggleMenu = (open) => {
  navLinks.classList.toggle("is-open", open);
  nav.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", String(open));
};
burger.addEventListener("click", () => toggleMenu(!navLinks.classList.contains("is-open")));
$$("a", navLinks).forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

/* ---------- Biens ---------- */
const grid = $("#propertyGrid");
const emptyState = $("#emptyState");
const state = { type: "all", transaction: "all", budget: 0 };

function renderProperties() {
  const list = PROPERTIES.filter((p) =>
    (state.type === "all" || p.type === state.type) &&
    (state.transaction === "all" || p.transaction === state.transaction) &&
    // le budget ne s'applique qu'aux biens à vendre
    (!state.budget || p.transaction === "location" || p.price <= state.budget)
  );

  grid.innerHTML = list.map((p, i) => `
    <article class="property" tabindex="0" data-id="${p.id}" style="animation-delay:${i * 70}ms" aria-label="${p.title}, ${formatPrice(p)}">
      <div class="property__img">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <span class="tag ${p.transaction === "location" ? "tag--location" : ""}">${p.transaction === "location" ? "À louer" : "À vendre"}</span>
      </div>
      <div class="property__body">
        <p class="property__price">${formatPrice(p)}</p>
        <h3 class="property__title">${p.title}</h3>
        <p class="property__loc">${p.location}</p>
        <ul class="property__specs">
          <li><strong>${p.surface}</strong> m²</li>
          ${p.rooms ? `<li><strong>${p.rooms}</strong> pièces</li>` : ""}
          ${p.bedrooms ? `<li><strong>${p.bedrooms}</strong> ch.</li>` : ""}
        </ul>
      </div>
    </article>`).join("");

  emptyState.hidden = list.length > 0;
}

$$(".chip").forEach((chip) =>
  chip.addEventListener("click", () => {
    $$(".chip").forEach((c) => c.classList.toggle("is-active", c === chip));
    state.type = chip.dataset.filter;
    $("#heroSearch").type.value = state.type;
    renderProperties();
  })
);

$("#heroSearch").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  state.type = f.type.value;
  state.transaction = f.transaction.value;
  state.budget = Number(f.budget.value);
  $$(".chip").forEach((c) => c.classList.toggle("is-active", c.dataset.filter === state.type));
  renderProperties();
  $("#biens").scrollIntoView();
});

/* ---------- Modale détail ---------- */
const modal = $("#modal");

function openProperty(id) {
  const p = PROPERTIES.find((x) => x.id === Number(id));
  if (!p) return;
  $("#modalBody").innerHTML = `
    <img src="${p.image}" alt="${p.title}">
    <div class="modal__content">
      <p class="eyebrow">${p.transaction === "location" ? "À louer" : "À vendre"} · ${p.location}</p>
      <h3>${p.title}</h3>
      <p class="property__price">${formatPrice(p)}</p>
      <p>${p.description}</p>
      <ul class="modal__features">
        <li>${p.surface} m²</li>
        ${p.rooms ? `<li>${p.rooms} pièces</li>` : ""}
        ${p.bedrooms ? `<li>${p.bedrooms} chambres</li>` : ""}
        ${p.features.map((f) => `<li>${f}</li>`).join("")}
      </ul>
      <button class="btn" data-visit="${p.id}">Demander une visite</button>
    </div>`;
  modal.showModal();
}

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".property");
  if (card) openProperty(card.dataset.id);
});
grid.addEventListener("keydown", (e) => {
  const card = e.target.closest(".property");
  if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProperty(card.dataset.id); }
});
$("#modalClose").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

// « Demander une visite » pré-remplit le formulaire de contact
modal.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-visit]");
  if (!btn) return;
  const p = PROPERTIES.find((x) => x.id === Number(btn.dataset.visit));
  $("#projetSelect").value = p.transaction === "location" ? "Je souhaite louer" : "Je souhaite acheter";
  $("#messageField").value = `Bonjour, je souhaiterais visiter le bien « ${p.title} » (${p.location}, réf. ${p.id}).`;
  modal.close();
  $("#contact").scrollIntoView();
});

/* ---------- Compteurs ---------- */
function animateCount(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const start = performance.now();
  const duration = 1600;
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- Apparition au défilement ---------- */
$$(".section__title, .service, .about__media, .about__text, .card, .contact__info").forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    if (entry.target.dataset.count) animateCount(entry.target);
    io.unobserve(entry.target);
  });
}, { threshold: 0.15 });
$$(".reveal, [data-count]").forEach((el) => io.observe(el));

/* ---------- Slider avis ---------- */
(function slider() {
  const track = $(".slider__track");
  const slides = $$(".quote", track);
  const dots = $(".slider__dots");
  let index = 0;
  let timer;

  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `Avis ${i + 1}`);
    b.addEventListener("click", () => { go(i); restart(); });
    dots.appendChild(b);
  });

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    $$("button", dots).forEach((d, j) => d.setAttribute("aria-selected", String(j === index)));
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 6000);
  }
  go(0);
  restart();
})();

/* ---------- Estimation ---------- */
$("#estimateForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  const surface = Number(f.surface.value);
  const pricePerM2 = Number(f.zone.value) * Number(f.etat.value) * (f.type.value === "maison" ? 1.05 : 1);
  const base = surface * pricePerM2;
  const round = (n) => Math.round(n / 1000) * 1000;
  $("#estimateResult").innerHTML = `
    Estimation indicative
    <strong>${euro.format(round(base * 0.92))} – ${euro.format(round(base * 1.08))}</strong>
    <small>Pour une estimation précise, <a href="#contact">demandez une visite gratuite</a>.</small>`;
});

/* ---------- Contact ---------- */
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  const status = $("#formStatus");
  let valid = true;

  $$("[required]", f).forEach((field) => {
    const ok = field.value.trim() !== "" && field.checkValidity();
    field.classList.toggle("is-invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    status.textContent = "Merci de compléter les champs obligatoires.";
    status.className = "form__status err";
    return;
  }

  // Envoi simulé : branchez ici votre service (Formspree, Netlify Forms, API…)
  status.textContent = `Merci ${f.nom.value.trim()} ! Votre message a bien été envoyé, je vous recontacte sous 24 h.`;
  status.className = "form__status ok";
  f.reset();
});

$("#year").textContent = new Date().getFullYear();
renderProperties();
