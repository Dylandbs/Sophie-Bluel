const body = document.querySelector("body");
const form = document.querySelector("form");
const loginEl = document.querySelector("#login");
const mesProjets = document.querySelector("#title-portfolio");
const sectionPortfolio = document.querySelector("#portfolio");

// Fonction pour lire le cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const cookie = getCookie("token");

const elementUpdate = () => {
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
      <p>Mode-edition</p>`;

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

const logIn = () => {
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log(form);

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      try {
        const res = await fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const log = await res.json();
          document.cookie = `token=${log.token}; path=/; max-age=3600`; // expire dans 1 heure
          window.location.href = "index.html";
        } else {
          const existingError = document.querySelector(".error-log");
          if (!existingError) {
            const email = document.querySelector("#email");
            const errorLog = document.createElement("p");
            errorLog.classList.add("error-log");
            errorLog.textContent =
              "Erreur dans l'identifiant ou le mot de passe";
            email?.insertAdjacentElement("afterend", errorLog);
          }
        }
      } catch (error) {
        alert("Erreur de connexion au serveur");
        console.error(error);
      }
    });
  } else {
    console.error("Le formulaire n'éxiste pas");
  }
};

const logOut = () => {
  if (!loginEl) {
    throw new Error("Erreur le login n'existe pas");
  }

  if (getCookie("token")) {
    loginEl.textContent = "logout";
    loginEl.addEventListener("click", () => {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      alert("Vous êtes déconnectée");
      window.location.reload();
    });
  } else {
    loginEl.textContent = "login";
    loginEl.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
};

const filterData = async () => {
  const allBtn = document.querySelector("#all");
  const objetsBtn = document.querySelector("#objets");
  const appartementsBtn = document.querySelector("#appartements");
  const restaurantsBtn = document.querySelector("#restaurants");
  const allFigures = document.querySelectorAll(".gallery figure");

  try {
    const res = await fetch("http://localhost:5678/api/categories");
    const categorie = await res.json();
    localStorage.setItem("filterImg", JSON.stringify(categorie));

    const recupArray = (key) => {
      const arrayFilter = localStorage.getItem(key);
      if (arrayFilter) {
        return JSON.parse(arrayFilter);
      } else {
        return null;
      }
    };

    const categorieFilter = recupArray("filterImg");

    allFigures.forEach((element) => {
      if (allBtn)
        allBtn.addEventListener("click", () => {
          element.style.display = "block";
        });
    });

    categorieFilter.forEach((element) => {
      if (element.name === "Objets") {
        objetsBtn?.addEventListener("click", () => {
          allFigures.forEach((figure) => {
            const figureId = figure.getAttribute("data-category-id");

            if (figureId === element.id.toString()) {
              figure.style.display = "block";
            } else {
              figure.style.display = "none";
            }
          });
        });
      } else if (element.name === "Appartements") {
        appartementsBtn?.addEventListener("click", () => {
          allFigures.forEach((figure) => {
            const figureId = figure.getAttribute("data-category-id");

            if (figureId === element.id.toString()) {
              figure.style.display = "block";
            } else {
              figure.style.display = "none";
            }
          });
        });
      } else if (element.name === "Hotels & restaurants") {
        restaurantsBtn?.addEventListener("click", () => {
          allFigures.forEach((figure) => {
            const figureId = figure.getAttribute("data-category-id");

            if (figureId === element.id.toString()) {
              figure.style.display = "block";
            } else {
              figure.style.display = "none";
            }
          });
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
};

elementUpdate();
logIn();
logOut();
filterData();
