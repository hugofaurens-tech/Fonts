/* En-tête, pied de page et bouton WhatsApp communs à toutes les pages.
   Les textes viennent de content/site.json (modifiable dans le back-office). */
CMS.pret.then(function () {
  const e = CMS.echapper;
  const page = document.body.dataset.page; // accueil | biens | estimation | contact
  const tel = SITE.telephone.replace(/\s/g, "");
  const nav = [
    ["biens.html", "Biens", "biens"],
    ["estimation.html", "Estimation", "estimation"],
    ["biens.html#projet", "Votre projet", "projet"],
    ["index.html#pourquoi", "À propos", "apropos"],
  ];

  const logo = (variant) => `
    <a href="index.html" class="logo logo--${variant}" aria-label="${e(SITE.nom)} — accueil">
      <img src="assets/img/logo-sf-${variant === "light" ? "blanc" : "noir"}.png" alt="" width="62" height="76">
      <span><strong>${e(SITE.nom)}</strong>${e(SITE.sousTitre)}</span>
    </a>`;

  document.getElementById("site-header").innerHTML = `
    <div class="header__inner">
      ${logo("dark")}
      <nav class="nav" id="nav" aria-label="Navigation principale">
        ${nav.map(([href, label, key]) => `<a href="${href}"${key === page ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
        <a href="contact.html" class="btn btn--contact"${page === "contact" ? ' aria-current="page"' : ""}>Contact</a>
      </nav>
      <button class="burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    </div>`;

  document.getElementById("site-footer").innerHTML = `
    <div class="container footer__grid">
      <div>
        ${logo("light")}
        <p class="footer__slogan">${CMS.texte(SITE.slogan)}</p>
        <p class="footer__desc">${CMS.texte(SITE.description)}</p>
        <ul class="footer__legal">
          <li><a href="#">Mentions légales</a></li>
          <li><a href="#">Conditions générales d’utilisation</a></li>
          <li><a href="#">Politique de confidentialité</a></li>
        </ul>
      </div>
      <div>
        <h2 class="footer__title">Navigation</h2>
        <ul class="footer__links">
          <li><a href="biens.html">Biens en vente</a></li>
          <li><a href="estimation.html">Estimation immobilière</a></li>
          <li><a href="biens.html#projet">Projet d'achat</a></li>
          <li><a href="index.html#pourquoi">À propos</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h2 class="footer__title">Contact</h2>
        <ul class="footer__links footer__contact">
          <li>${e(SITE.agence)}</li>
          ${(SITE.adresse || []).map((l) => `<li>${e(l)}</li>`).join("")}
          <li class="gap">Ligne directe :&nbsp; <a href="tel:${tel}">${e(SITE.telephone)}</a></li>
          <li><a href="mailto:${e(SITE.email)}">${e(SITE.email)}</a></li>
        </ul>
        <div class="socials">
          <a href="${e(SITE.instagram)}" target="_blank" rel="noopener" aria-label="Instagram"><img src="assets/icons/instagram.png" alt=""></a>
          <a href="${e(SITE.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn"><img src="assets/icons/linkedin.png" alt=""></a>
        </div>
      </div>
    </div>
    <p class="footer__copy">© ${new Date().getFullYear()} ${e(SITE.copyright)}</p>`;

  const wa = document.createElement("a");
  wa.className = "whatsapp";
  wa.href = `https://wa.me/${SITE.whatsapp}`;
  wa.target = "_blank";
  wa.rel = "noopener";
  wa.setAttribute("aria-label", "Me contacter sur WhatsApp");
  wa.innerHTML = '<img src="assets/icons/whatsapp.png" alt="">';
  document.body.appendChild(wa);

  const burger = document.getElementById("burger");
  const header = document.getElementById("site-header");
  burger.addEventListener("click", () => {
    const open = header.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  header.querySelectorAll(".nav a").forEach((a) =>
    a.addEventListener("click", () => {
      header.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    })
  );
});
