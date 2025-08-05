<template>
  <div class="flex justify-end gap-5">
    <input
      type="text"
      placeholder="Поиск..."
      class="w-48 outline-none border border-gray-400 rounded-xl p-2"
    />
    <button
      class="bg-green-300 text-white p-2 rounded-xl cursor-pointer transition duration-200 hover:opacity-90"
    >
      Добавить питомца
    </button>
  </div>
  <PetList />
</template>

<script setup>
import PetList from "@/components/PetList.vue";
</script>

<style scoped></style>
