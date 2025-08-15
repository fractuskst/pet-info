const API_URL = "http://localhost:5000/pets";

export async function getPets() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Ошибка загрузки питомцев");
  return await res.json();
}

export async function getPet(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Ошибка загрузки питомца");
  return await res.json();
}

export async function deletePet(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Ошибка удаления питомца");
  return await res.json();
}

export async function createPet(petData) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(petData),
  });
  if (!res.ok) throw new Error("Ошибка создания питомца");
  return await res.json();
}

export async function updatePet(id, petData) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(petData),
  });
  if (!res.ok) throw new Error("Ошибка обновления питомца");
  return await res.json();
}
