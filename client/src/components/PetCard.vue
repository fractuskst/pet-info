<template>
  <div
    class="flex flex-col gap-4 rounded-lg shadow p-6 hover:-translate-y-1 transition cursor-pointer h-full"
    @click="openPetDetails(pet.id)"
  >
    <div class="aspect-[3/4] overflow-hidden rounded-xl">
      <img
        :src="pet.mainPhoto || placeholder"
        :alt="pet.name"
        class="w-full h-full"
      />
    </div>

    <div class="flex flex-col items-left">
      <h2 class="font-bold text-md">{{ pet.name }}</h2>
      <p class="text-gray-400 text-sm">{{ pet.type }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import placeholder from "@/assets/images/pet-placeholder.png";

defineProps({
  pet: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const openPetDetails = (petId) => {
  router.push(`/${petId}`);
};
</script>
