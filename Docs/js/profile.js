const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/Pages/login.html";
} else {
  fetch("http://localhost:3000/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((user) => {
      if (user.avatar) {
        document.querySelector(".profile-link img").src = "/" + user.avatar;
        document.getElementById("avatarPreview").src = "/" + user.avatar;
      }
      document.getElementById("usernameDisplay").textContent = user.username;
      document.getElementById("usernameInput").value = user.username;

      document.getElementById("ageDisplay").textContent = user.age || "";
      document.getElementById("ageInput").value = user.age || "";

      document.getElementById("genderDisplay").textContent = user.gender || "";
      document.getElementById("genderInput").value = user.gender || "";
    })
    .catch((err) => {
      console.error(err);
      window.location.href = "/Pages/login.html";
    });
}

// Édition
document.getElementById("editBtn").addEventListener("click", () => {
  document
    .querySelectorAll(".value")
    .forEach((el) => (el.style.display = "none"));
  document
    .querySelectorAll(".edit-field")
    .forEach((el) => (el.style.display = "inline-block"));
  document.getElementById("editBtn").style.display = "none";
  document.getElementById("saveBtn").style.display = "inline-block";
  document.getElementById("avatarLabel").style.display = "inline";
});

// Preview image
document.getElementById("avatarInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.getElementById("avatarPreview").src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Sauvegarde
document.getElementById("saveBtn").addEventListener("click", async () => {
  const username = document.getElementById("usernameInput").value;
  const age = document.getElementById("ageInput").value;
  const gender = document.getElementById("genderInput").value;
  const avatar = document.getElementById("avatarInput").files[0];

  const formData = new FormData();
  formData.append("username", username);
  formData.append("age", age);
  formData.append("gender", gender);
  if (avatar) {
    formData.append("avatar", avatar);
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/me", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const msg = await res.json();
      throw new Error(msg.message || "Erreur API");
    }

    showPopup("✅ Profil mis à jour avec succès");
    exitEditMode();
  } catch (err) {
    console.error("Erreur lors de la sauvegarde :", err);
    alert("Erreur lors de la mise à jour du profil");
  }
});

function showPopup(message) {
  const popup = document.createElement("div");
  popup.textContent = message;
  Object.assign(popup.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#4caf50",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
    fontSize: "16px",
    zIndex: "1000",
    opacity: "0",
    transition: "opacity 0.5s ease",
  });
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.style.opacity = "1";
  }, 10);
  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => popup.remove(), 500);
  }, 2000);
}

function exitEditMode() {
  document
    .querySelectorAll(".edit-field")
    .forEach((el) => (el.style.display = "none"));
  document
    .querySelectorAll(".value")
    .forEach((el) => (el.style.display = "inline"));
  document.getElementById("editBtn").style.display = "inline-block";
  document.getElementById("saveBtn").style.display = "none";
  document.getElementById("avatarLabel").style.display = "none";

  document.getElementById("usernameDisplay").textContent =
    document.getElementById("usernameInput").value;
  document.getElementById("ageDisplay").textContent =
    document.getElementById("ageInput").value;
  document.getElementById("genderDisplay").textContent =
    document.getElementById("genderInput").value;
}
