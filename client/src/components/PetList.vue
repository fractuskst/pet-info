<template>
  <div class="grid justify-center grid-cols-[repeat(auto-fit,minmax(250px,300px))] gap-4 mb-10">
    <PetCard v-for="pet in pets" :key="pet.id" :pet="pet" />
  </div>
</template>

<script setup>
defineProps({
  pets: Array,
});

import PetCard from "./PetCard.vue";
</script>
