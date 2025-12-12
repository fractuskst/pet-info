import * as petService from "@/services/pet.service";
import handleClientError from "@/utils/handleClientError";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

export const usePetsStore = defineStore("pets", () => {
  const selectedPet = ref(null);
  const pets = ref([]);
  const isLoading = ref(false);

  const getPets = async () => {
    isLoading.value = true;
    try {
      const fetchedPets = await petService.getPets();
      pets.value = fetchedPets;
    } catch (err) {
      handleClientError(err, "Ошибка загрузки питомцев");
    } finally {
      isLoading.value = false;
    }
  };

  const getPet = async (id) => {
    isLoading.value = true;
    try {
      const fetchedPet = await petService.getPet(id);
      selectedPet.value = fetchedPet;
    } catch (err) {
      handleClientError(err, "Ошибка загрузки питомца");
    } finally {
      isLoading.value = false;
    }
  };

  const createPet = async (formData) => {
    isLoading.value = true;
    try {
      const newPet = await petService.createPet(formData);
      pets.value.push(newPet);
      toast.success("Питомец успешно добавлен!");
    } catch (err) {
      handleClientError(err, "Ошибка создания питомца");
    } finally {
      isLoading.value = false;
    }
  };

  const updatePet = async (formData) => {
    isLoading.value = true;
    try {
      const upldatedPet = await petService.updatePet(selectedPet.value.id, formData);
      selectedPet.value = upldatedPet;

      const index = pets.value.findIndex((p) => p.id === upldatedPet.id);
      if (index !== -1) {
        Object.assign(pets.value[index], upldatedPet);
      }
      toast.success("Питомец успешно обновлен!");
    } catch (err) {
      handleClientError(err, "Ошибка обновления питомца");
    } finally {
      isLoading.value = false;
    }
  };

  const deletePet = async (id) => {
    try {
      isLoading.value = true;
      await petService.deletePet(id);
      pets.value = pets.value.filter((pet) => pet.id !== id);
      selectedPet.value = null;
      toast.success("Питомец успешно удален!");
    } catch (err) {
      handleClientError(err, "Ошибка удаления питомца");
    } finally {
      isLoading.value = false;
    }
  };

  return { selectedPet, pets, isLoading, getPets, getPet, createPet, updatePet, deletePet };
});
