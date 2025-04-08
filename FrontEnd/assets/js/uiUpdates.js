import { getCookie } from './auth.js';
import { updateGallery } from "./gallery.js";

const elementUpdate = () => {
  const body = document.querySelector("body");
  const mesProjets = document.getElementById("title-portfolio");
  const sectionPortfolio = document.getElementById("portfolio");
  const cookie = getCookie("token");

  if (mesProjets && !cookie) {
    const navFilterImg = document.createElement("nav");
    navFilterImg.classList.add("filter-gallery");
    navFilterImg.innerHTML = `
      <p id="all">Tous</p>
      <p id="objets">Objets</p>
      <p id="appartements">Appartements</p>
      <p id="restaurants">Hotels & restaurants</p>
    `;
    mesProjets.insertAdjacentElement("afterend", navFilterImg);
  } else if (body && cookie) {
    const editionMode = document.createElement("div");
    editionMode.classList.add("edition-mode");
    editionMode.innerHTML = `
    <i class="fa-regular fa-pen-to-square"></i>
      <p>Mode edition</p>`;

    body.prepend(editionMode);

    const titleH2Portfolio = document.querySelector("#title-portfolio");
    titleH2Portfolio?.remove();
    const headerPortfolio = document.createElement("div");
    headerPortfolio.classList.add("header-portfolio");
    headerPortfolio.innerHTML = `
          <h2 id="title-portfolio">Mes Projets</h2>
           <div class="modify">
            <i class="fa-regular fa-pen-to-square"></i>
            <p>Modifier</p>
          </div>
        `;
    sectionPortfolio?.prepend(headerPortfolio);
  }
};



export { elementUpdate };