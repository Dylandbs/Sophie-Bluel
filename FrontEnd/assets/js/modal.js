import { getCookie } from "./auth.js";
import { recupArray, updateGallery, deleteIcons } from "./gallery.js";

const urlApi = "http://localhost:5678/api/works";
let modalInitial = false;
let originalContent = null;
let currentPage = 1;
let formDataCache = {
  title: "",
  category: "",
  imageFile: null,
  imageUrl: null,
};

const closeModal = () => {
  const modale = document.getElementById("modale");

  if (modale) {
    modale.style.display = "none";
    currentPage = 1;
    formDataCache = {
      title: "",
      category: "",
      imageFile: null,
      imageUrl: null,
    };
  }
};

const openModale = async () => {
  const modale = document.getElementById("modale");
  modale.style.display = "flex";

  if (!modalInitial) {
    const containerModale = document.getElementById("modale-container");
    originalContent = containerModale.innerHTML;
    modalInitial = true;
  }

  if (currentPage !== 1) {
    const containerModale = document.getElementById("modale-container");
    containerModale.innerHTML = originalContent;
    currentPage = 1;
  }

  const galleryModale = document.querySelector(".gallery-modale");
  if (galleryModale) {
    await updateGallery(galleryModale, false);
    deleteIcons();
  }
  setupNavigation();
};

const setupNavigation = () => {
  document.getElementById("addImg")?.addEventListener("click", (e) => {
    e.preventDefault();
    updateModalContent(2);
  });

  document.getElementById("return")?.addEventListener("click", handleReturn);

  document
    .getElementById("close-modale")
    ?.addEventListener("click", closeModal);

  const modale = document.getElementById("modale");
  modale?.addEventListener("click", (e) => {
    if (e.target === modale) {
      closeModal();
    }
  });
};

const handleReturn = () => {
  if (currentPage === 2) updateModalContent(1);
  if (currentPage === 3) updateModalContent(2);
};

const updateModalContent = (page) => {
  const containerModale = document.getElementById("modale-container");
  currentPage = page;

  switch (page) {
    case 1:
      containerModale.innerHTML = originalContent;
      setupNavigation();

      const galleryModale = document.querySelector(".gallery-modale");
      if (galleryModale) {
        updateGallery(galleryModale, false).then(() => {
          deleteIcons();
        });
      }
      break;

    case 2:
      containerModale.innerHTML = `
        <i class="fa-solid fa-arrow-left btn-return" id="return"></i>
        <i class="fa-solid fa-xmark btn-container" id="close-modale"></i>
        <h3>Ajout photo</h3>
        <div class="img-add">
          <img src="./assets/images/picture-svgrepo-com 1.png" alt="" id="placeholder-image" />
          <label class="custom-file-button">
            + Ajouter photo
            <input type="file" class="hidden-file-input" id="file-input">
          </label>
          <p>jpg, png : 4mo max</p>
          <div id="file-error" style="color: red; margin-top: 5px;"></div>
        </div>
        <div class="info-img">
          <label for="titre" class="name-input">Titre</label>
          <input type="text" name="titre" id="titre" value="" />
          <label for="categorie" class="name-input">Catégorie</label>
          <select name="categorie" id="categorie-filter-img">
            <option value=""></option>
            ${generateCategoryOptions()}
          </select>
          <div class="line"></div>
        </div>
        <button class="btn-add-img" id="submit-img" disabled>
          Valider
        </button>
      `;

      document.getElementById("categorie-filter-img").value =
        formDataCache.category;
      const btnAddImg = document.querySelector(".btn-add-img");
      if (btnAddImg) {
        btnAddImg.style.backgroundColor = "#a7a7a7";
      }
      setupPreview();
      setupNavigation();
      break;

    case 3:
      containerModale.innerHTML = `
        <i class="fa-solid fa-arrow-left btn-return" id="return"></i>
        <i class="fa-solid fa-xmark btn-container" id="close-modale"></i>
        <h3>Ajout photo</h3>
        <div class="img-add">
          <div class="image-preview-container">
            <img src="${
              formDataCache.imageUrl
            }" alt="Preview" class="image-preview" />
          </div>
        </div>
        <div class="info-img">
          <label for="titre" class="name-input">Titre</label>
          <input type="text" name="titre" id="titre" value="${
            formDataCache.title
          }" />
          <label for="categorie" class="name-input">Catégorie</label>
          <select name="categorie" id="categorie-filter-img">
            ${generateCategoryOptions()}
          </select>
          <div class="line"></div>
        </div>
        <button class="btn-add-img" id="submit-img"}>
          Valider
        </button>
      `;
      document.getElementById("categorie-filter-img").value =
        formDataCache.category;
      setupPreview();
      setupNavigation();
      submitProject();
      break;
  }
};

const generateCategoryOptions = () => {
  const categorieFilter = recupArray("filterImg");
  let optionsHTML = "";

  if (categorieFilter) {
    categorieFilter.forEach((category) => {
      optionsHTML += `<option value="${category.id}">${category.name}</option>`;
    });
  }
  return optionsHTML;
};

const setupPreview = () => {
  const fileInput = document.getElementById("file-input");
  const errorDiv = document.getElementById("file-error");

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      errorDiv.textContent = "";

      if (!file) return;

      const validTypes = ["image/jpeg", "image/png"];
      const validExtensions = ["jpg", "jpeg", "png"];
      const extension = file.name.split(".").pop().toLowerCase();

      if (
        !validTypes.includes(file.type) ||
        !validExtensions.includes(extension)
      ) {
        errorDiv.textContent =
          "Format de fichier non valide (seuls JPG/PNG sont autorisés)";
        e.target.value = "";
        formDataCache.imageFile = null;
        return;
      }

      if (file.size > 4 * 1024 * 1024) {
        errorDiv.textContent = "Le fichier dépasse 4 Mo";
        e.target.value = "";
        formDataCache.imageFile = null;
        return;
      }

      formDataCache.imageFile = file;
      formDataCache.imageUrl = URL.createObjectURL(file);
      updateModalContent(3);
    });
  }

  document.getElementById("titre")?.addEventListener("input", (e) => {
    formDataCache.title = e.target.value;
  });

  document
    .getElementById("categorie-filter-img")
    ?.addEventListener("change", (e) => {
      formDataCache.category = e.target.value;
    });
};

const submitProject = () => {
  const btnValidate = document.getElementById("submit-img");
  btnValidate?.addEventListener("click", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", formDataCache.imageFile);
    formData.append("title", formDataCache.title);
    formData.append("category", formDataCache.category);

    try {
      const res = await fetch(urlApi, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const gallery = document.querySelector(".gallery");
        if (gallery) {
          await updateGallery(gallery, true);
        }

        formDataCache = {
          title: "",
          category: "",
          imageFile: null,
          imageUrl: null,
        };

        alert("Projet ajouté avec succès !");

        updateModalContent(2);

        const galleryModale = document.querySelector(".gallery-modale");
        if (galleryModale) {
          await updateGallery(galleryModale, false);
          deleteIcons();
        }
      } else {
        throw new Error("Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert(`Échec de l'envoi : ${error.message}`);
    }
  });
};

const initModal = () => {
  document.querySelector(".modify")?.addEventListener("click", openModale);

  const modale = document.getElementById("modale");
  modale?.addEventListener("click", (e) => {
    if (e.target === modale) {
      closeModal();
    }
  });
};

export { openModale, initModal, closeModal };
