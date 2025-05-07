const apiBase = "https://u05-restful-api.onrender.com/characters";
const characterList = document.getElementById("character-list");
const form = document.getElementById("character-form");
const editForm = document.getElementById("edit-character-form");
let currentCharacterId = null;

function showError(inputElement, message) {
  const errorElement = document.getElementById(inputElement.id + "-error");
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

function clearError(inputElement) {
  const errorElement = document.getElementById(inputElement.id + "-error");
  errorElement.textContent = "";
  errorElement.style.display = "none";
}

async function loadCharacters() {
  const res = await fetch(apiBase);
  const characters = await res.json();

  characterList.innerHTML = "";
  characters.forEach(char => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${char.name}</strong> – ${char.original_game_series}  
      <br>Weight: ${char.weight_class} <br> Speed: ${char.movement_speed}
      <br>
      <button onclick="deleteCharacter('${char._id}')">Delete</button>
      <button onclick="editCharacter('${char._id}')">Update</button>
    `;
    characterList.appendChild(div);
  });
}

async function editCharacter(id) {
  const res = await fetch(`${apiBase}/${id}`);
  const character = await res.json();

  document.getElementById("edit-name").value = character.name;
  document.getElementById("edit-tier_ranking").value = character.tier_ranking;
  document.getElementById("edit-weight_class").value = character.weight_class;
  document.getElementById("edit-movement_speed").value = character.movement_speed;
  document.getElementById("edit-original_game_series").value = character.original_game_series;

  currentCharacterId = id;

  editForm.style.display = "block";
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(editForm);
  const characterData = Object.fromEntries(data);

  const res = await fetch(`${apiBase}/${currentCharacterId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(characterData),
  });

  if (res.ok) {
    alert("Character updated!");
    editForm.style.display = "none";
    loadCharacters();
  } else {
    alert("Something went wrong while updating");
  }
});

document.getElementById("cancel-edit").addEventListener("click", () => {
  editForm.style.display = "none";
});

form.addEventListener("submit", async e => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));

  let formIsValid = true;

  if (!data.name) {
    showError(document.getElementById("name"), "Please enter a name");
    formIsValid = false;
  } else {
    clearError(document.getElementById("name"));
  }

  if (!data.tier_ranking) {
    showError(document.getElementById("tier_ranking"), "Please select a tier ranking");
    formIsValid = false;
  } else {
    clearError(document.getElementById("tier_ranking"));
  }

  if (!data.weight_class) {
    showError(document.getElementById("weight_class"), "Please select a weight class");
    formIsValid = false;
  } else {
    clearError(document.getElementById("weight_class"));
  }

  console.log('Data being sent to API:', data);

  if (!formIsValid) {
    return;
  }

  const res = await fetch(apiBase, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    form.reset();
    loadCharacters();
  } else {
    const errorText = await res.text();
    console.error('Error response from API:', errorText);
    alert("Something went wrong");
  }
});

async function deleteCharacter(id) {
  await fetch(`${apiBase}/${id}`, { method: "DELETE" });
  loadCharacters();
}

loadCharacters();
