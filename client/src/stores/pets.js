import { createPet, deletePet, getPet, getPets, updatePet } from "@/services/petService";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

export const usePetsStore = defineStore("pets", () => {
  const selectedPet = ref(null);
  const pets = ref([]);
  const isLoading = ref(false);

  async function fetchPets() {
    isLoading.value = true;
    try {
      const data = await getPets();
      pets.value = data;
    } catch (err) {
      toast.error(`Ошибка загрузки питомцев: ${err.message}`);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPet(id) {
    isLoading.value = true;
    try {
      const pet = await getPet(id);
      selectedPet.value = pet;
    } catch (err) {
      toast.error(`Ошибка загрузки питомца: ${err.message}`);
    } finally {
      isLoading.value = false;
    }
  }

  async function addPet(formData) {
    try {
      const newPet = await createPet(formData);

      pets.value.push(newPet);
      toast.success("Питомец успешно добавлен!");
    } catch (err) {
      toast.error(`Ошибка создания питомца: ${err.message}`);
    }
  }

  async function editPet(formData) {
    try {
      const updatedPet = await updatePet(selectedPet.value.id, formData);
      selectedPet.value = updatedPet;

      const index = pets.value.findIndex((p) => p.id === updatedPet.id);
      if (index !== -1) {
        Object.assign(pets.value[index], updatedPet);
      }
      toast.success("Питомец успешно обновлен!");
    } catch (err) {
      toast.error(`Ошибка обновления питомца: ${err.message}`);
    }
  }

  async function removePet(id) {
    try {
      await deletePet(id);
      pets.value = pets.value.filter((pet) => pet.id !== id);
      selectedPet.value = null;
      toast.success("Питомец успешно удален!");
    } catch (err) {
      toast.error(`Ошибка удаления питомца: ${err.message}`);
    }
  }

  return { selectedPet, pets, isLoading, fetchPets, fetchPet, addPet, editPet, removePet };
});
