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
    <Button @click="handleOpenForm" :disabled="petsStore.isLoading">Добавить питомца</Button>
  </div>

  <Spinner v-if="petsStore.isLoading" class="self-center p-16" />

  <PetList v-else-if="filteredPets.length" :pets="filteredPets" />
  <p v-else class="text-center font-semibold p-10">
    <span>Питомцев пока нет :(</span> <br />
    <span>Добавьте первого!</span>
  </p>

  <PetForm />

  <SelectMainPhotoModal />
</template>

<script setup>
import PetForm from "@/components/PetForm.vue";
import SelectMainPhotoModal from "@/components/SelectMainPhotoModal.vue";
import PetList from "@/components/PetList.vue";
import Button from "@/components/ui/PrimaryButton.vue";
import Spinner from "@/components/ui/Spinner.vue";
import { Search } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { usePetsStore } from "@/stores/pets";
import { useAppStore } from "@/stores/app";

const petsStore = usePetsStore();
const appStore = useAppStore();

onMounted(() => {
  petsStore.fetchPets();
});

const searchQuery = ref("");

const filteredPets = computed(() => {
  if (!searchQuery.value.trim()) return petsStore.pets;
  return petsStore.pets.filter((pet) => pet.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const handleOpenForm = () => {
  appStore.isPetFormOpen = true;
};
</script>
