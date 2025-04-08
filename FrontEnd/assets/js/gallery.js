import { getCookie } from "./auth.js";

const urlApi = "http://localhost:5678/api/works";



const updateGallery = async (targetGallery, shouldAddTitle) => {
  try {
    const res = await fetch(urlApi);
    if (!res.ok) {
      throw new Error(`Erreur HTTP : ${res.status}`);
    }
    const categories = await res.json();
    console.log(categories);

    targetGallery.innerHTML = '';

    categories.forEach((categorie) => {
      const figure = document.createElement("figure");
      figure.setAttribute("data-category-id", categorie.categoryId);
      figure.setAttribute("data-id", categorie.id);

      const addImg = document.createElement("img");
      addImg.src = categorie.imageUrl;
      addImg.alt = categorie.title;
      figure.appendChild(addImg);

      if (shouldAddTitle) {
        const addTitle = document.createElement("figcaption");
        addTitle.textContent = categorie.title;
        figure.appendChild(addTitle);
      }

      if (!shouldAddTitle) {
        const trashIcon = document.createElement("i");
        trashIcon.className = "fa-solid fa-trash-can";
        figure.appendChild(trashIcon);
      }

      targetGallery.appendChild(figure);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
};

const deleteIcons = () => {
  const iconTrash = document.querySelectorAll("figure i");
  iconTrash.forEach((icon) => {
    icon.addEventListener("click", async (event) => {
      event.stopPropagation();

      const parentFigure = icon.closest("figure");
      if (!parentFigure) {
        throw new Error("Erreur : la figure parent de l'icon n'existe pas");
      }
      const figureId = parentFigure.getAttribute("data-id");

      if (parentFigure) {
        try {
          const res = await fetch(`${urlApi}/${figureId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getCookie("token")}`,
            },
          });
          if (res.ok) {
            parentFigure.remove();
            console.log("Figure supprimée avec succès");

            const gallery = document.querySelector(".gallery");
        const galleryModale = document.querySelector('.gallery-modale')

        await updateGallery(gallery, true);
        await updateGallery(galleryModale, false);
          } else {
            console.error(
              "Erreur lors de la suppression de la figure",
              res.statusText
            );
          }
        } catch (error) {
          console.error("Erreur de connexion à l'API:", error);
        }
      }
    });
  });
};

const recupArray = (key) => {
  const arrayFilter = localStorage.getItem(key);
  return arrayFilter ? JSON.parse(arrayFilter) : null;
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


export { filterData, deleteIcons, updateGallery, recupArray };
