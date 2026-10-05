/* ============================================================
   Chargement du contenu (dossier content/, modifié via le back-office)
   puis remplissage de la page.

   Dans le HTML :
     data-t="chemin"      → texte (les retours à la ligne deviennent <br>)
     data-img="chemin"    → image (attribut src)
     data-bg="chemin"     → image de fond (variable CSS --bg)
     data-list="chemin"   → liste : le <template> enfant est répété pour chaque élément,
                            ses chemins sont alors relatifs à l'élément.
   Le chemin "site.xxx" désigne content/site.json, les autres le fichier
   content/pages/<data-content>.json de la page.
   ============================================================ */
const CMS = (() => {
  const charger = (chemin) =>
    fetch(chemin, { cache: "no-cache" }).then((r) => {
      if (!r.ok) throw new Error(`${chemin} : ${r.status}`);
      return r.json();
    });

  const lire = (obj, chemin) =>
    chemin.split(".").reduce((o, cle) => (o == null ? undefined : o[cle]), obj);

  const echapper = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // Texte saisi dans le back-office → HTML sûr (retours à la ligne conservés)
  const texte = (s) => echapper(s).replace(/\n/g, "<br>");

  // Texte long → paragraphes (séparés par une ligne vide)
  const paragraphes = (s) =>
    String(s || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${texte(p)}</p>`).join("");

  const vide = (v) => v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length);

  function appliquer(racine, donnees) {
    racine.querySelectorAll("[data-t]").forEach((el) => {
      const v = lire(donnees, el.dataset.t);
      el.hidden = vide(v);
      if (!vide(v)) el.innerHTML = texte(v);
    });
    racine.querySelectorAll("[data-img]").forEach((el) => {
      const v = lire(donnees, el.dataset.img);
      el.hidden = vide(v);
      if (!vide(v)) el.src = v;
    });
    racine.querySelectorAll("[data-bg]").forEach((el) => {
      const v = lire(donnees, el.dataset.bg);
      // Adresse complète : sinon le navigateur la résoudrait depuis le dossier css/
      if (!vide(v)) el.style.setProperty("--bg", `url("${new URL(v, document.baseURI).href}")`);
    });
    racine.querySelectorAll("[data-list]").forEach((liste) => {
      const modele = liste.querySelector(":scope > template");
      const elements = lire(donnees, liste.dataset.list) || [];
      liste.querySelectorAll(":scope > :not(template)").forEach((n) => n.remove());
      elements.forEach((item) => {
        const copie = modele.content.cloneNode(true);
        appliquer(copie, item);
        liste.appendChild(copie);
      });
    });
  }

  const page = document.body.dataset.content;
  const pret = Promise.all([
    charger("content/site.json"),
    charger("content/biens.json"),
    charger("content/avis.json"),
    page ? charger(`content/pages/${page}.json`) : Promise.resolve({}),
  ]).then(([site, biens, avis, contenu]) => {
    window.SITE = site;
    window.BIENS = biens.biens || [];
    window.AVIS = avis.avis || [];
    window.PAGE = contenu;
    appliquer(document, { ...contenu, site });
    document.body.classList.remove("cms-loading");
    return contenu;
  });

  pret.catch((err) => {
    console.error(err);
    document.body.classList.remove("cms-loading");
    const msg = document.createElement("p");
    msg.className = "cms-error";
    msg.textContent = "Le contenu de la page n’a pas pu être chargé. Merci de réessayer dans un instant.";
    document.body.prepend(msg);
  });

  return { pret, texte, paragraphes, echapper, appliquer };
})();
