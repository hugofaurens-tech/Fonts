/* Page d'un bien : remplie à partir de content/biens.json selon ?id=... dans l'adresse. */
CMS.pret.then(function () {
  const e = CMS.echapper;
  const id = new URLSearchParams(location.search).get("id");
  const bien = BIENS.find((b) => b.id === id);

  if (!bien) {
    $("#fiche").hidden = true;
    $("#introuvable").hidden = false;
    document.title = "Bien introuvable — " + SITE.nom;
    return;
  }

  const vendu = bien.statut === "vendu";
  const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? "s" : ""}`;
  const lieu = bien.adresse || `${bien.ville} - ${bien.quartier}`;
  const tel = SITE.telephone.replace(/\s/g, "");
  const lienVisite = `contact.html?projet=achat&bien=${encodeURIComponent(bien.id)}`;

  document.title = `${bien.titre} — ${bien.ville} — ${SITE.nom}`;
  const meta = $('meta[name="description"]');
  meta.content = `${bien.titre}, ${pluriel(bien.pieces, "pièce")} de ${bien.surface} m² à ${bien.ville} : ${euros(bien.prix)}.`;

  // Fil d'Ariane et retour
  const liste = vendu ? "biens-vendus.html" : "biens.html";
  $("#fil-liste").textContent = vendu ? "Biens vendus" : "Biens à vendre";
  $("#fil-liste").href = liste;
  $("#retour").href = liste;
  $("#fil-titre").textContent = bien.titre;

  // Galerie
  const photos = bien.photos && bien.photos.length ? bien.photos : [bien.photo];
  let courante = 0;
  const principale = $("#photo-principale");
  const vignettes = $("#vignettes");
  $("#statut").textContent = vendu ? "Vendu" : "En vente";

  function montrer(i) {
    courante = (i + photos.length) % photos.length;
    principale.src = photos[courante];
    principale.alt = `${bien.titre} — photo ${courante + 1} sur ${photos.length}`;
    // Les 3 vignettes montrent les photos suivantes
    const suivantes = [1, 2, 3].map((k) => (courante + k) % photos.length).filter((j) => j !== courante);
    const uniques = [...new Set(suivantes)];
    vignettes.innerHTML = uniques.map((j) =>
      `<button type="button" data-photo="${j}" aria-label="Voir la photo ${j + 1}"><img src="${e(photos[j])}" alt="" loading="lazy"></button>`
    ).join("");
  }
  vignettes.addEventListener("click", (e) => {
    const b = e.target.closest("[data-photo]");
    if (b) montrer(Number(b.dataset.photo));
  });
  $(".gallery__arrow--prev").addEventListener("click", () => montrer(courante - 1));
  $(".gallery__arrow--next").addEventListener("click", () => montrer(courante + 1));
  if (photos.length < 2) {
    $$(".gallery__arrow").forEach((b) => (b.hidden = true));
    $(".gallery").classList.add("gallery--single");
  }
  montrer(0);

  // En-tête
  $("#titre").textContent = `${bien.titre} - ${pluriel(bien.pieces, "pièce")} de ${bien.surface} m2 à ${bien.ville}`;
  $("#adresse span").textContent = lieu;
  const specs = [
    ["surface", `${bien.surface} m2`],
    ["porte", pluriel(bien.pieces, "pièce")],
    bien.chambres && ["lit", pluriel(bien.chambres, "chambre")],
    bien.sallesDeBain && ["baignoire", `${bien.sallesDeBain} salle${bien.sallesDeBain > 1 ? "s" : ""} de bain`],
  ].filter(Boolean);
  $("#specs").innerHTML = specs.map(([icone, texte]) => `<li><img src="assets/icons/${icone}.png" alt="">${e(texte)}</li>`).join("");

  // Prix
  $("#prix").textContent = euros(bien.prix);
  $("#prix-m2").textContent = `${euros(Math.round(bien.prix / bien.surface / 100) * 100)} du m2 - honoraires inclus`;
  $("#btn-tel").href = `tel:${tel}`;
  if (vendu) {
    $(".price-box__label").textContent = "Vendu au prix de";
    $("#btn-visite").textContent = "Faire estimer mon bien";
    $("#btn-visite").href = "estimation.html";
    $(".interest").hidden = true;
  } else {
    $("#btn-visite").href = lienVisite;
    $("#btn-visite-2").href = lienVisite;
  }

  // Rubriques facultatives
  const remplir = (bloc, ok, fn) => { if (ok) fn(); else $(bloc).hidden = true; };
  remplir("#bloc-description", bien.description, () => ($("#description").innerHTML = CMS.paragraphes(bien.description)));
  remplir("#bloc-points", bien.pointsForts && bien.pointsForts.length, () => {
    $("#points-forts").innerHTML = bien.pointsForts.map((p) => `<li><img src="assets/icons/check.png" alt="">${e(p)}</li>`).join("");
  });
  remplir("#bloc-equipements", bien.equipements && bien.equipements.length, () => {
    $("#equipements").innerHTML = bien.equipements.map((x) => `<li>${e(x)}</li>`).join("");
  });
  remplir("#bloc-quartier", bien.quartierTexte, () => ($("#quartier").innerHTML = CMS.paragraphes(bien.quartierTexte)));

  const caracteristiques = [
    ["surface", "Surface habitable", `${bien.surface} m2`],
    ["porte", "Typologie", pluriel(bien.pieces, "pièce")],
    ["lit", "Chambres", bien.chambres],
    ["baignoire", "Salles de bain", bien.sallesDeBain],
    ["escalier", "Étage", bien.etage],
    ["calendrier", "Année de construction", bien.annee],
    ["flamme", "Chauffage", bien.chauffage],
    ["eclair", "DPE", bien.dpe],
    [null, "Charges mensuelles", bien.charges && euros(bien.charges)],
    [null, "Taxes foncières annuelles", bien.taxeFonciere && euros(bien.taxeFonciere)],
  ].filter(([, , v]) => v !== undefined && v !== null && v !== "");
  $("#caracteristiques").innerHTML = caracteristiques.map(([icone, label, valeur]) => `
    <div class="${icone ? "" : "no-icon"}">
      ${icone ? `<img src="assets/icons/${icone}.png" alt="">` : ""}
      <dt>${label}</dt><dd>${e(valeur)}</dd>
    </div>`).join("");

  // Biens similaires : même type d'abord, puis les autres biens en vente
  const autres = BIENS.filter((b) => b.statut === "vente" && b.id !== bien.id);
  autres.sort((a, b) => (b.type === bien.type) - (a.type === bien.type));
  if (autres.length) {
    $("#liste-similaires").innerHTML = autres.slice(0, 3).map(carteBien).join("");
  } else {
    $("#similaires").hidden = true;
  }
});
