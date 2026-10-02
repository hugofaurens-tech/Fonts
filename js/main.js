/* Comportements des pages : biens, avis, estimation, formulaires.
   Le contenu (biens, avis, textes) est chargé par js/cms.js. */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const euros = (n) => new Intl.NumberFormat("fr-FR").format(n).replace(/ | /g, " ") + " €";

/* ---------- Cartes de biens ---------- */
function carteBien(b) {
  const e = CMS.echapper;
  return `
    <article class="card">
      <div class="card__photo">
        <img src="${e(b.photo)}" alt="${e(b.titre)} — ${e(b.ville)}" loading="lazy">
        <span class="card__tag">${b.statut === "vendu" ? "Vendu" : "En vente"}</span>
      </div>
      <h3 class="card__title"><a href="bien.html?id=${encodeURIComponent(b.id)}">${e(b.titre)}</a></h3>
      <p class="card__loc"><img src="assets/icons/pin.png" alt="">${e(b.ville)}${b.quartier ? " - " + e(b.quartier) : ""}</p>
      <p class="card__price">${euros(b.prix)}</p>
      <ul class="card__specs">
        <li class="chip">${b.surface}m2</li>
        <li>${b.pieces} pièce${b.pieces > 1 ? "s" : ""}</li>
        ${b.dpe ? `<li>DPE ${e(b.dpe)}</li>` : ""}
      </ul>
    </article>`;
}

/* ---------- Envoi des formulaires ---------- */
async function envoyer(form, sujet) {
  const data = new FormData(form);
  data.append("_subject", sujet);
  if (SITE.formEndpoint) {
    const res = await fetch(SITE.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("Envoi impossible");
  }
}

function valider(champs) {
  let ok = true;
  champs.forEach((c) => {
    const valide = c.checkValidity() && c.value.trim() !== "";
    c.classList.toggle("is-invalid", !valide);
    if (!valide && ok) { c.focus(); ok = false; }
  });
  return ok;
}

CMS.pret.then(() => {
  // Accueil : les 3 premiers biens en vente
  const selection = $("#selection");
  if (selection) {
    selection.innerHTML = BIENS.filter((b) => b.statut === "vente").slice(0, 3).map(carteBien).join("");
  }

  // Page Biens : filtres + pagination
  const liste = $("#liste-biens");
  if (liste) {
    const PAR_PAGE = 9;
    const statut = liste.dataset.statut;
    const form = $("#filtres");
    const pager = $("#pagination");
    let resultats = [];
    let page = 1;

    // Remplit les listes déroulantes à partir des biens existants
    const uniques = (cle) => [...new Set(BIENS.filter((b) => b.statut === statut).map((b) => b[cle]))].sort();
    uniques("type").forEach((t) => form.type.add(new Option(t[0].toUpperCase() + t.slice(1), t)));
    uniques("ville").forEach((v) => form.ville.add(new Option(v, v)));

    function filtrer() {
      const min = Number(form.min.value) || 0;
      const max = Number(form.max.value) || Infinity;
      resultats = BIENS.filter((b) =>
        b.statut === statut &&
        (!form.type.value || b.type === form.type.value) &&
        (!form.ville.value || b.ville === form.ville.value) &&
        b.prix >= min && b.prix <= max
      );
      page = 1;
      afficher();
    }

    function afficher() {
      const debut = (page - 1) * PAR_PAGE;
      liste.innerHTML = resultats.length
        ? resultats.slice(debut, debut + PAR_PAGE).map(carteBien).join("")
        : '<p class="empty">Aucun bien ne correspond à votre recherche. <a href="contact.html">Contactez-moi</a>, je peux vous proposer des biens off-market.</p>';

      const pages = Math.ceil(resultats.length / PAR_PAGE);
      pager.hidden = pages < 2;
      pager.innerHTML = Array.from({ length: pages }, (_, i) =>
        `<button type="button" data-page="${i + 1}"${i + 1 === page ? ' aria-current="page"' : ""}>${i + 1}</button>`
      ).join("") + (page < pages ? '<button type="button" class="next" data-page="' + (page + 1) + '" aria-label="Page suivante">›</button>' : "");
    }

    pager.addEventListener("click", (e) => {
      const b = e.target.closest("[data-page]");
      if (!b) return;
      page = Number(b.dataset.page);
      afficher();
      $("#liste").scrollIntoView({ behavior: "smooth" });
    });
    form.addEventListener("submit", (e) => { e.preventDefault(); filtrer(); });
    filtrer();
  }

  /* ---------- Avis clients (3 par page) ---------- */
  $$(".reviews").forEach((zone) => {
    const PAR_PAGE = 3;
    const avis = AVIS;
    const e = CMS.echapper;
    const pages = Math.ceil(avis.length / PAR_PAGE);
    const track = $(".reviews__list", zone);
    const dots = $(".dots", zone);
    let courante = 0;

    function afficher(p) {
      courante = p;
      track.innerHTML = avis.slice(p * PAR_PAGE, p * PAR_PAGE + PAR_PAGE).map((a) => `
        <blockquote class="review">
          <div class="review__head">
            <span class="review__avatar" aria-hidden="true"></span>
            <div><cite>${e(a.nom)}</cite><p class="review__loc"><img src="assets/icons/pin.png" alt="">${e(a.lieu)}</p></div>
          </div>
          <p>${CMS.texte(a.texte)}</p>
        </blockquote>`).join("");
      $$("button", dots).forEach((d, i) => d.setAttribute("aria-current", String(i === p)));
    }

    dots.innerHTML = Array.from({ length: pages }, (_, i) => `<button type="button" aria-label="Avis page ${i + 1}"></button>`).join("");
    dots.hidden = pages < 2;
    $$("button", dots).forEach((d, i) => d.addEventListener("click", () => afficher(i)));
    afficher(0);
  });

  /* ---------- Estimation en 4 étapes ---------- */
  const estimation = $("#form-estimation");
  if (estimation) {
    const etapes = $$(".step", estimation);
    const puces = $$(".stepper li");
    let n = 0;

    function aller(i, defiler = true) {
      n = i;
      etapes.forEach((e, j) => (e.hidden = j !== i));
      puces.forEach((p, j) => p.classList.toggle("is-active", j === i));
      if (defiler) $("#estimer").scrollIntoView({ behavior: "smooth" });
    }

    // Étapes 1 et 3 : un clic sur un choix le sélectionne
    $$(".choices", estimation).forEach((groupe) => {
      groupe.addEventListener("change", () => {
        groupe.classList.remove("is-invalid");
        if (groupe.dataset.auto !== undefined) setTimeout(() => aller(n + 1), 250);
      });
    });

    estimation.addEventListener("click", (e) => {
      if (e.target.closest("[data-prev]")) aller(n - 1);
      if (e.target.closest("[data-next]")) {
        const etape = etapes[n];
        const radios = $(".choices", etape);
        if (radios && !$("input:checked", radios)) { radios.classList.add("is-invalid"); return; }
        if (valider($$("input[required]:not([type=radio])", etape))) aller(n + 1);
      }
    });

    estimation.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!valider($$("input[required]", etapes[n]))) return;
      const bouton = $("[type=submit]", estimation);
      bouton.disabled = true;
      try {
        await envoyer(estimation, "Nouvelle demande d'estimation");
        location.href = "merci.html?demande=estimation";
      } catch {
        bouton.disabled = false;
        $("#estimation-erreur").hidden = false;
      }
    });

    aller(0, false);
  }

  /* ---------- Contact ---------- */
  const contact = $("#form-contact");
  if (contact) {
    const params = new URLSearchParams(location.search);
    if (params.get("projet")) contact.projet.value = params.get("projet");
    const bien = BIENS.find((b) => b.id === params.get("bien"));
    if (bien) contact.message.value = `Bonjour, je souhaiterais visiter le bien « ${bien.titre} » (${bien.ville}, ${euros(bien.prix)}).`;

    contact.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!valider($$("[required]", contact))) return;
      const bouton = $("[type=submit]", contact);
      bouton.disabled = true;
      try {
        await envoyer(contact, "Nouvelle demande de contact");
        location.href = "merci.html?demande=contact";
      } catch {
        bouton.disabled = false;
        $("#contact-erreur").hidden = false;
      }
    });
  }

  /* ---------- Liens téléphone / e-mail ---------- */
  $$(".js-tel").forEach((a) => (a.href = "tel:" + SITE.telephone.replace(/\s/g, "")));
  $$(".js-mail").forEach((a) => (a.href = "mailto:" + SITE.email));

  /* ---------- Page de confirmation ---------- */
  const merci = $("#merci-texte");
  if (merci && new URLSearchParams(location.search).get("demande") === "estimation") {
    merci.innerHTML = CMS.texte(PAGE.texte_estimation);
  }
});
