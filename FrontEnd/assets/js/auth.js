import { updateGallery } from "./gallery.js";

const getCookie = (name) => {
  const allCookies = `; ${document.cookie}`;
  const parts = allCookies.split(`; ${name}=`);

  if (parts.length === 2) {
    const afterEqualSign = parts.pop();
    const allPartsAfterSplit = afterEqualSign.split(";");
    const cookieValue = allPartsAfterSplit.shift();
    return cookieValue;
  }
};

const logIn = () => {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

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
          document.cookie = `token=${log.token}; path=/; max-age=86400`;
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
  const loginEl = document.getElementById("login");
  const cookie = getCookie("token");

  if (!loginEl) {
    throw new Error("Erreur : le login n'existe pas");
  }

  if (cookie) {
    loginEl.textContent = "logout";
    loginEl.addEventListener("click", async () => {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      alert("Vous êtes déconnecté");

      const gallery = document.querySelector(".gallery");
      if (gallery) {
        window.location.reload();
      } else {
        console.error("Erreur : l'élément .gallery n'existe pas dans le DOM");
        window.location.reload();
      }
    });
  } else {
    loginEl.textContent = "login";
    loginEl.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
};



export { getCookie, logIn, logOut };
