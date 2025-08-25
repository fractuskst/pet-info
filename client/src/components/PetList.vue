<template>
  <div
    class="grid justify-items-center grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 mb-10"
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
