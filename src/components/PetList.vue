<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5"
  >
    <PetCard v-for="pet in pets" :key="pet.id" :pet="pet" />
  </div>
</template>

<script setup>
defineProps({
  pets: Array,
});

import PetCard from "./PetCard.vue";
</script>
