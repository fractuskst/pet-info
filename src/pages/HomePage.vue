<template>
  <div class="flex justify-end gap-5">
    <input
      type="text"
      id="search"
      placeholder="Поиск..."
      class="w-1/3 sm:w-1/5 outline-none border border-gray-400 rounded-xl p-2 focus:border-gray-500"
    />
    <button
      class="outline-none border bg-green-300 text-white p-2 rounded-xl cursor-pointer transition duration-200 hover:opacity-90 focus:border focus:border-green-500"
      @click="openForm"
    >
      Добавить питомца
    </button>
  </div>
  <PetList />
  <AddPetForm v-model:isOpen="isFormOpen" />
</template>

<script setup>
import AddPetForm from "@/components/AddPetForm.vue";
import PetList from "@/components/PetList.vue";
import { ref } from "vue";

const isFormOpen = ref(false);

const openForm = () => {
  isFormOpen.value = true;
};
</script>
