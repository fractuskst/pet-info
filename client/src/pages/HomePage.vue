<template>
  <div class="flex justify-end gap-5">
    <input
      class="w-1/3 sm:w-2/5 md:w-2/6 outline-none border border-gray-400 rounded-xl p-2 focus:border-gray-500"
      type="text"
      id="search"
      placeholder="Поиск..."
      :disabled="isLoading"
      v-model="searchQuery"
    />

    <Button @click="handleOpenForm" :disabled="isLoading"
      >Добавить питомца</Button
    >
  </div>

  <p v-if="isLoading" class="text-center font-semibold p-16">
    Загружаем питомцев...
  </p>

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
import { getPets } from "@/services/petService";
import { computed, onMounted, ref } from "vue";

const isLoading = ref(true);
const pets = ref([]);
const searchQuery = ref("");
const isFormOpen = ref(false);

onMounted(async () => {
  try {
    pets.value = await getPets();
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const filteredPets = computed(() => {
  if (!searchQuery.value.trim()) return pets.value;
  return pets.value.filter((pet) =>
    pet.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const handleOpenForm = () => {
  isFormOpen.value = true;
};

const handlePetAdded = (newPet) => {
  pets.value.push(newPet);
};
</script>
