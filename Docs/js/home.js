const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/Pages/login.html";
} else {
  console.log("Token actuel :", token);

  fetch("http://localhost:3000/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        const message = await res.json();
        console.error("Erreur serveur :", message);
        throw new Error("Erreur API");
      }
      return res.json();
    })
    .then((user) => {
      if (user.avatar) {
        document.querySelector(".profile-link img").src = "/" + user.avatar;
      }
    })
    .catch((err) => {
      console.error("Erreur attrapée :", err);
      window.location.href = "/Pages/login.html"; // sécurité si problème
    });
}

// Charger les utilisateurs actifs
fetch("http://localhost:3000/api/auth/users", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((users) => {
    const tbody = document.querySelector(".utilisateurs-actifs tbody");
    tbody.innerHTML = "";

    users.forEach((user) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
          <td>
            <img src="/${
              user.avatar
            }" alt="pp" style="width:32px;height:32px;border-radius:50%;vertical-align:middle;margin-right:8px;">
            <span>${user.username}</span>
          </td>
          <td>${user.gender || ""}</td>
          <td>${user.age || ""}</td>
        `;

      tbody.appendChild(tr);
    });
  })
  .catch((err) => {
    console.error("Erreur chargement utilisateurs :", err);
  });

// Fonction pour (re)charger avec filtres
function chargerUtilisateurs(filtres = {}) {
  const query = new URLSearchParams(filtres).toString();
  fetch(`http://localhost:3000/api/auth/users?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((users) => {
      const tbody = document.querySelector(".utilisateurs-actifs tbody");
      tbody.innerHTML = "";

      users.forEach((user) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
              <img src="/${
                user.avatar
              }" alt="pp" style="width:32px;height:32px;border-radius:50%;vertical-align:middle;margin-right:8px;">
              <span>${user.username}</span>
            </td>
            <td>${user.gender || ""}</td>
            <td>${user.age || ""}</td>
          `;

        tbody.appendChild(tr);
      });
    })
    .catch((err) => {
      console.error("Erreur filtrage utilisateurs :", err);
    });
}

// Écouteur de soumission du formulaire
document.querySelector(".form-filtre").addEventListener("submit", (e) => {
  e.preventDefault();

  const nom = e.target.nom.value.trim();
  const genre = e.target.genre.value;
  const age = e.target.age.value;

  const filtres = {};
  if (nom) filtres.nom = nom;
  if (genre && genre !== "Genre") filtres.genre = genre;
  if (age) filtres.age = age;

  chargerUtilisateurs(filtres); // recharge avec filtres
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-filtre");

  if (!form) {
    console.error("❌ Le formulaire de filtre n'a pas été trouvé.");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("✅ Formulaire de filtre soumis");

    const nom = form.nom.value.trim();
    const genre = form.genre.value;
    const age = form.age.value;

    const filtres = {};
    if (nom) filtres.nom = nom;
    if (genre && genre !== "Genre") filtres.genre = genre;
    if (age) filtres.age = age;

    fetch(
      "http://localhost:3000/api/auth/users?" + new URLSearchParams(filtres),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((users) => {
        const tbody = document.querySelector(".utilisateurs-actifs tbody");
        tbody.innerHTML = "";

        users.forEach((user) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
              <td>
                <img src="/${
                  user.avatar
                }" alt="pp" style="width:32px;height:32px;border-radius:50%;vertical-align:middle;margin-right:8px;">
                <span>${user.username}</span>
              </td>
              <td>${user.gender || ""}</td>
              <td>${user.age || ""}</td>
            `;
          tbody.appendChild(tr);
        });
      })
      .catch((err) => {
        console.error("Erreur filtre utilisateurs :", err);
      });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-filtre");

  if (!form) {
    console.error("❌ Le formulaire de filtre n'a pas été trouvé.");
    return;
  }

  // Écouteur pour le bouton "Filtrer"
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("✅ Formulaire de filtre soumis");

    const nom = form.nom.value.trim();
    const genre = form.genre.value;
    const age = form.age.value;

    const filtres = {};
    if (nom) filtres.nom = nom;
    if (genre && genre !== "Genre") filtres.genre = genre;
    if (age) filtres.age = age;

    fetch(
      "http://localhost:3000/api/auth/users?" + new URLSearchParams(filtres),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((users) => {
        const tbody = document.querySelector(".utilisateurs-actifs tbody");
        tbody.innerHTML = "";

        users.forEach((user) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
              <td>
                <img src="/${
                  user.avatar
                }" alt="pp" style="width:32px;height:32px;border-radius:50%;vertical-align:middle;margin-right:8px;">
                <span>${user.username}</span>
              </td>
              <td>${user.gender || ""}</td>
              <td>${user.age || ""}</td>
            `;
          tbody.appendChild(tr);
        });
      })
      .catch((err) => {
        console.error("Erreur filtre utilisateurs :", err);
      });
  });

  // Écouteur pour le bouton "Réinitialiser"
  form.addEventListener("reset", () => {
    console.log("🔄 Formulaire réinitialisé");
    // Recharge la liste complète des utilisateurs
    fetch("http://localhost:3000/api/auth/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((users) => {
        const tbody = document.querySelector(".utilisateurs-actifs tbody");
        tbody.innerHTML = "";

        users.forEach((user) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
              <td>
                <img src="/${
                  user.avatar
                }" alt="pp" style="width:32px;height:32px;border-radius:50%;vertical-align:middle;margin-right:8px;">
                <span>${user.username}</span>
              </td>
              <td>${user.gender || ""}</td>
              <td>${user.age || ""}</td>
            `;
          tbody.appendChild(tr);
        });
      })
      .catch((err) => {
        console.error("Erreur chargement utilisateurs :", err);
      });
  });
});
