<template>
  <div
    class="flex flex-col gap-4 rounded-lg shadow p-6 hover:-translate-y-1 transition cursor-pointer"
    @click="handleOpenPetDetails(pet.id)"
  >
    <div class="relative group aspect-[3/4] overflow-hidden rounded-xl">
      <img :src="pet.mainPhoto || placeholder" :alt="pet.name" class="w-full h-full object-cover" />
      <Button
        :icon="Camera"
        customClass="absolute bg-gray-400 bottom-0 left-0 right-0 opacity-0 translate-y-full duration-300 group-hover:translate-y-0 group-hover:opacity-50"
        @click.stop="handleOpenMainPhotoModal"
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
import Button from "./ui/PrimaryButton.vue";
import { Camera } from "lucide-vue-next";
import placeholder from "@/assets/images/pet-placeholder.png";
import { useAppStore } from "@/stores/app";
import { usePhotosStore } from "@/stores/photos";
import { usePetsStore } from "@/stores/pets";

const props = defineProps({
  pet: {
    type: Object,
    required: true,
  },
});

const appStore = useAppStore();
const photosStore = usePhotosStore();
const petsStore = usePetsStore();

const router = useRouter();

const handleOpenPetDetails = (petId) => {
  router.push(`/${petId}`);
};

const handleOpenMainPhotoModal = async () => {
  petsStore.selectedPet = props.pet;
  await photosStore.fetchPhotos(props.pet.id);
  appStore.isMainPhotoModalOpen = true;
};
</script>
