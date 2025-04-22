import { elementUpdate } from "./uiUpdates.js";
import { logIn, logOut } from "./auth.js";
import { filterData, deleteIcons, updateGallery } from "./gallery.js";
import { initModal } from "./modal.js";

const initApp = async () => {
  elementUpdate();
  logIn();
  logOut();

  const gallery = document.querySelector(".gallery");
  const galleryModale = document.querySelector('.gallery-modale')

  if (gallery) {
    await updateGallery(gallery, true);
    await updateGallery(galleryModale, false);
    await filterData();
    deleteIcons();
  } else {
    console.error("Erreur : l'élément .gallery n'existe pas dans le DOM");
  }
  initModal();
};

document.addEventListener("DOMContentLoaded", initApp);