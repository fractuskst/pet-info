<template>
  <div class="flex justify-end gap-5">
    <input
      class="w-1/3 sm:w-2/5 md:w-2/6 outline-none border border-gray-400 rounded-xl p-2 focus:border-gray-500"
      type="text"
      id="search"
      placeholder="Поиск..."
      @input="handleSearch"
    />
    <button
      class="outline-none border bg-green-300 text-white p-2 rounded-xl cursor-pointer transition duration-200 hover:opacity-90 focus:border focus:border-green-500"
      @click="openForm"
    >
      Добавить питомца
    </button>
  </div>
  <PetList :pets="clonedPets" />
  <AddPetForm v-model:isOpen="isFormOpen" v-model:pets="clonedPets" />
</template>

<script setup>
import AddPetForm from "@/components/AddPetForm.vue";
import PetList from "@/components/PetList.vue";
import { ref } from "vue";

const pets = ref([
  {
    id: 1,
    name: "Чуня Грушева",
    type: "Кошка",
    owner: "Костя и Маша",
    birthDate: "6.10.2023",
    breed: "Метис",
    mainPhoto: "Чуня.jpg",
    favToys: "Резинки, зажимы от батона, мышки",
    description:
      "Выбор конкретного подхода зависит от ваших требований к гибкости и необходимости кастомизации отдельных полей. Выбор конкретного подхода зависит от ваших требований к гибкости и необходимости кастомизации отдельных полей Выбор конкретного подхода зависит от ваших требований к гибкости и необходимости кастомизации отдельных полей",
    additionalPhotos: [
      "Чуня.jpg",
      "Чуня2.jpg",
      "Чуня3.jpg",
      "Чуня4.jpg",
      "Чуня5.jpg",
    ],
  },
  {
    id: 2,
    name: "Кузя Кислодрищев",
    type: "Кот",
    owner: "Костя и Маша",
    birthDate: "17.08.2024",
    mainPhoto: "Кузя.jpg",
  },
]);

const clonedPets = ref([...pets.value]);

const handleSearch = (e) => {
  const searchQuery = e.target.value.toLowerCase().trim();

  if (!searchQuery) {
    clonedPets.value = [...pets.value];
    return;
  }

  const filteredPets = clonedPets.value.filter((pet) =>
    pet.name.toLowerCase().includes(searchQuery),
  );
  clonedPets.value = filteredPets;
};

const isFormOpen = ref(false);

const openForm = () => {
  isFormOpen.value = true;
};
</script>
