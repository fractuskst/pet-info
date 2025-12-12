<template>
  <Overlay v-if="appStore.isMainPhotoModalOpen" @click.self="handleCloseModal">
    <div class="relative bg-white p-6 rounded-xl w-full max-w-2xl my-auto">
      <X
        class="absolute stroke-gray-500 size-5 right-5 cursor-pointer hover:stroke-gray-600"
        @click="handleCloseModal"
      />
      <div v-if="photosStore.photosCount" class="flex flex-col gap-5">
        <h2 class="text-center font-semibold">Выберите основную фотографию</h2>
        <PhotosGrid :onPhotoClick="(photo) => handlePhotoClick(photo)" />
      </div>
      <h2 v-else class="text-center font-semibold">Нет фотографий для выбора</h2>
    </div>
  </Overlay>
</template>

<script setup>
import { useAppStore } from "@/stores/useAppStore";
import { usePetsStore } from "@/stores/usePetsStore";
import { usePhotosStore } from "@/stores/usePhotosStore";
import PhotosGrid from "./PhotosGrid.vue";
import Overlay from "./ui/Overlay.vue";
import { X } from "lucide-vue-next";
import { onMounted, onUnmounted } from "vue";

const appStore = useAppStore();
const petsStore = usePetsStore();
const photosStore = usePhotosStore();

const handlePhotoClick = async (photo) => {
  await petsStore.updatePet({ mainPhoto: photo.url });
  petsStore.selectedPet = null;
  handleCloseModal();
};

const handleCloseModal = () => {
  appStore.isMainPhotoModalOpen = false;
  photosStore.photos = [];
};

const handleEscape = (e) => {
  if (e.key === "Escape" && appStore.isMainPhotoModalOpen) {
    handleCloseModal();
  }
};

onMounted(() => window.addEventListener("keyup", handleEscape));
onUnmounted(() => window.removeEventListener("keyup", handleEscape));
</script>
