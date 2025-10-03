<template>
  <div class="flex justify-center sm:justify-end gap-5">
    <div class="relative self-center w-1/3 lg:w-1/5">
      <Search v-if="!searchQuery" class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      <input
        :class="[
          'w-full outline-none border border-gray-400 rounded-xl pr-2 p-2 focus:border-gray-500',
          !searchQuery ? 'pl-8 sm:pl-10' : 'pl-3',
        ]"
        type="text"
        placeholder="Поиск..."
        v-model="searchQuery"
      />
    </div>
    <Button @click="handleOpenForm" :disabled="isLoading">Добавить питомца</Button>
  </div>

  <Spinner v-if="isLoading" class="self-center p-16" />

  <PetList v-else-if="filteredPets.length" :pets="filteredPets" />
  <p v-else class="text-center font-semibold p-10">
    <span>Питомцев пока нет :(</span> <br />
    <span>Добавьте первого!</span>
  </p>

  <PetForm v-model:isOpen="isFormOpen" @pet-added="handlePetAdded" />
</template>

<script setup>
import PetForm from "@/components/PetForm.vue";
import PetList from "@/components/PetList.vue";
import Button from "@/components/ui/Button.vue";
import Spinner from "@/components/ui/Spinner.vue";
import { Search } from "lucide-vue-next";
import { getPets } from "@/services/petService";
import { computed, onMounted, ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

const isLoading = ref(true);
const pets = ref([]);
const searchQuery = ref("");
const isFormOpen = ref(false);

onMounted(async () => {
  try {
    pets.value = await getPets();
  } catch (err) {
    toast.error(`Ошибка загрузки питомцев: ${err.message}`);
  } finally {
    isLoading.value = false;
  }
});

const filteredPets = computed(() => {
  if (!searchQuery.value.trim()) return pets.value;
  return pets.value.filter((pet) => pet.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const handleOpenForm = () => {
  isFormOpen.value = true;
};

const handlePetAdded = (newPet) => {
  pets.value.push(newPet);
};
</script>
