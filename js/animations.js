/* Animations sobres : apparition des blocs au défilement, compteur des chiffres clés,
   ombre de l'en-tête. Désactivées si le visiteur a demandé à réduire les animations. */
CMS.pret.then(() => {
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // En-tête : ombre dès qu'on quitte le haut de page ; il se compacte quand on descend
  // et reprend sa taille dès qu'on remonte.
  const header = document.getElementById("site-header");
  let dernierY = window.scrollY;
  const surDefilement = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 10);
    if (header.classList.contains("is-open")) return; // menu mobile ouvert : on ne touche à rien
    if (y < 120) header.classList.remove("is-compact");
    else if (y > dernierY + 4) header.classList.add("is-compact");
    else if (y < dernierY - 4) header.classList.remove("is-compact");
    if (Math.abs(y - dernierY) > 4) dernierY = y;
  };
  window.addEventListener("scroll", surDefilement, { passive: true });
  surDefilement();

  if (reduit || !("IntersectionObserver" in window)) return;

  const CIBLES = [
    ".hero__content > *", ".stats li",
    ".title", ".subtitle", ".step__intro", ".punchline", ".cta-line", ".section .actions",
    ".feature", ".benefit", ".step-card", ".perk", ".card", ".review", ".stars",
    ".tabs", ".filters", ".choices", ".fields", ".step__nav",
    ".contact-form", ".side-card",
    ".gallery", ".product__head", ".price-box", ".product__main > section", ".features-list", ".product__district",
    ".thanks .container > *", ".legal__intro", ".legal__section",
  ].join(",");

  // Compteur : « +100 » part de 0 et monte jusqu'à 100
  function compter(el) {
    const m = el.textContent.match(/^(\D*)(\d[\d\s]*)(.*)$/);
    if (!m) return;
    const fin = Number(m[2].replace(/\s/g, ""));
    const debut = performance.now();
    const duree = 1400;
    const etape = (t) => {
      const p = Math.min((t - debut) / duree, 1);
      const valeur = Math.round(fin * (1 - Math.pow(1 - p, 3)));
      el.textContent = m[1] + valeur.toLocaleString("fr-FR") + m[3];
      if (p < 1) requestAnimationFrame(etape);
    };
    requestAnimationFrame(etape);
  }

  const observateur = new IntersectionObserver((entrees) => {
    entrees.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      observateur.unobserve(target);
      target.classList.add("is-visible");
      const nombre = target.matches(".stats li") && target.querySelector("strong");
      if (nombre) compter(nombre);
      // Une fois apparu, l'élément retrouve ses propres transitions (survols)
      const delai = parseFloat(getComputedStyle(target).getPropertyValue("--delai")) || 0;
      setTimeout(() => {
        target.classList.remove("reveal", "is-visible");
        target.style.removeProperty("--delai");
      }, 900 + delai * 1000);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  function preparer(el) {
    if (el.dataset.anime) return;
    el.dataset.anime = "1";
    // Léger décalage entre éléments voisins (cartes, atouts…), plafonné
    const freres = [...el.parentElement.children].filter((n) => n.matches(CIBLES));
    const rang = Math.min(freres.indexOf(el), 4);
    if (rang > 0) el.style.setProperty("--delai", `${rang * 0.1}s`);
    el.classList.add("reveal");
    observateur.observe(el);
  }

  document.querySelectorAll(CIBLES).forEach(preparer);

  // Éléments ajoutés plus tard (filtres, pagination, avis, étapes…)
  new MutationObserver((mutations) => {
    mutations.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.nodeType !== 1) return;
      if (n.matches(CIBLES)) preparer(n);
      n.querySelectorAll(CIBLES).forEach(preparer);
    }));
  }).observe(document.querySelector("main") || document.body, { childList: true, subtree: true });
});
