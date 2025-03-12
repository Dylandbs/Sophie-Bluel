
const form = document.querySelector("form");


// Fonction pour lire le cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const token = getCookie("token"); 



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
          alert("Erreur dans l'identifiant ou le mot de passe");
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


logIn();

