const loginForm = document.querySelector("form");
const signupBtn = document.querySelector(".signup-btn");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.ok) {
    alert("Connexion réussie !");
    localStorage.setItem("token", data.token); // On stocke le JWT
    window.location.href = "/Pages/home.html";  
  } else {
    alert(data.message || "Erreur lors de la connexion");
  }
});

signupBtn.addEventListener("click", async () => {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  const res = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.ok) {
    alert("Inscription réussie !");
  } else {
    alert(data.message || "Erreur lors de l'inscription");
  }
});
