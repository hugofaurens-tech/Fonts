/* ============================================================
   Bandeau de consentement aux cookies (recommandations CNIL) :
   - « Tout accepter » et « Tout refuser » au même niveau, choix détaillé possible ;
   - aucun cookie de mesure d'audience avant accord ;
   - choix mémorisé 6 mois dans le cookie « sf_consentement », puis redemandé ;
   - lien « Gestion des cookies » du pied de page pour changer d'avis.
   Textes et identifiant Google Analytics : content/site.json (back-office).
   ============================================================ */
CMS.pret.then(() => {
  const NOM = "sf_consentement";
  const DUREE = 60 * 60 * 24 * 182; // 6 mois, en secondes
  const e = CMS.echapper;
  const textes = {
    titre: "Votre vie privée",
    texte: "Ce site utilise des cookies nécessaires à son fonctionnement et, avec votre accord, des cookies de mesure d’audience pour améliorer nos services. Vous pouvez accepter, refuser ou personnaliser votre choix à tout moment.",
    ...(SITE.cookies || {}),
  };
  const gaId = (SITE.cookies && SITE.cookies.googleAnalytics) || "";

  const lire = () => {
    const m = document.cookie.match(new RegExp(`(?:^|; )${NOM}=([^;]*)`));
    try { return m ? JSON.parse(decodeURIComponent(m[1])) : null; } catch { return null; }
  };
  const ecrire = (choix) => {
    const valeur = encodeURIComponent(JSON.stringify({ ...choix, date: new Date().toISOString().slice(0, 10) }));
    document.cookie = `${NOM}=${valeur}; max-age=${DUREE}; path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  };

  // Mesure d'audience : chargée uniquement après accord
  function chargerMesure() {
    if (!gaId || window.gtag) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", gaId, { anonymize_ip: true });
  }

  const bandeau = document.createElement("section");
  bandeau.className = "cookies";
  bandeau.setAttribute("role", "dialog");
  bandeau.setAttribute("aria-labelledby", "cookies-titre");
  bandeau.hidden = true;
  bandeau.innerHTML = `
    <div class="cookies__inner">
      <div class="cookies__texte">
        <h2 id="cookies-titre">${e(textes.titre)}</h2>
        <p>${CMS.texte(textes.texte)}</p>
      </div>
      <div class="cookies__details" hidden>
        <label class="cookies__option">
          <input type="checkbox" checked disabled>
          <span><strong>Cookies nécessaires</strong>Indispensables au fonctionnement du site (mémorisation de votre choix). Toujours actifs.</span>
        </label>
        <label class="cookies__option">
          <input type="checkbox" name="mesure">
          <span><strong>Mesure d’audience</strong>Statistiques anonymes de fréquentation pour améliorer le site.</span>
        </label>
      </div>
      <div class="cookies__actions">
        <button type="button" class="btn btn--line cookies__btn" data-choix="refuser">Tout refuser</button>
        <button type="button" class="btn cookies__btn" data-choix="accepter">Tout accepter</button>
        <button type="button" class="cookies__lien" data-choix="personnaliser">Personnaliser</button>
        <button type="button" class="btn cookies__btn" data-choix="enregistrer" hidden>Enregistrer mes choix</button>
      </div>
    </div>`;
  document.body.appendChild(bandeau);

  const details = bandeau.querySelector(".cookies__details");
  const caseMesure = bandeau.querySelector('input[name="mesure"]');
  const btn = (nom) => bandeau.querySelector(`[data-choix="${nom}"]`);

  function ouvrir(detaille = false) {
    const choix = lire();
    caseMesure.checked = !!(choix && choix.mesure);
    details.hidden = !detaille;
    btn("personnaliser").hidden = detaille;
    btn("enregistrer").hidden = !detaille;
    bandeau.hidden = false;
    requestAnimationFrame(() => bandeau.classList.add("is-open"));
    (detaille ? caseMesure : btn("accepter")).focus({ preventScroll: true });
  }

  function valider(mesure) {
    const avant = lire();
    ecrire({ mesure });
    bandeau.classList.remove("is-open");
    setTimeout(() => (bandeau.hidden = true), 300);
    if (mesure) chargerMesure();
    // Retrait d'un accord déjà donné : on recharge pour couper la mesure d'audience
    else if (avant && avant.mesure && window.gtag) location.reload();
  }

  bandeau.addEventListener("click", (ev) => {
    const choix = ev.target.closest("[data-choix]");
    if (!choix) return;
    ({
      accepter: () => valider(true),
      refuser: () => valider(false),
      personnaliser: () => ouvrir(true),
      enregistrer: () => valider(caseMesure.checked),
    })[choix.dataset.choix]();
  });

  // Lien du pied de page
  document.addEventListener("click", (ev) => {
    if (ev.target.closest("[data-cookies]")) { ev.preventDefault(); ouvrir(true); }
  });

  const choix = lire();
  if (!choix) ouvrir(false);
  else if (choix.mesure) chargerMesure();
});
