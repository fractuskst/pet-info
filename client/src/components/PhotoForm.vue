<template>
  <Overlay v-if="appStore.isPhotoFormOpen" @mousedown.self="handleCloseForm">
    <form
      class="relative flex flex-col gap-2 bg-white p-6 rounded-xl w-full max-w-md my-auto"
      @submit.prevent="handleSubmit"
    >
      <h2 class="self-center font-semibold">Добавление фото</h2>

      <X
        class="absolute stroke-gray-500 size-5 right-5 cursor-pointer hover:stroke-gray-600"
        @click="handleCloseForm"
      />

      <div
        v-if="photosStore.freeSlots"
        class="border-dashed border-2 border-gray-300 rounded p-10 text-center cursor-pointer hover:border-gray-500 transition-colors"
        @drop.prevent="appStore.isDesktop && handleFileEvent($event)"
        @dragover.prevent
        @click="fileInput.click()"
      >
        <p class="text-gray-500">
          {{ dropzoneText }}
        </p>
        <p class="text-gray-400">Можно добавить ещё {{ photosStore.freeSlots }} фото</p>

        <input ref="fileInput" type="file" multiple accept="image/*" class="hidden" @change="handleFileEvent" />
      </div>

      <div v-if="photosStore.previewUrls.length" class="flex justify-center flex-wrap gap-2 mt-2">
        <div v-for="(img, index) in photosStore.previewUrls" :key="img.toString()" class="relative">
          <img :src="img" class="w-18 h-18 object-cover rounded" />
          <X
            class="absolute top-0 right-0 stroke-gray-500 size-5 cursor-pointer hover:stroke-gray-600"
            @click="!photosStore.isLoading && photosStore.removePreparedPhoto(index)"
          />
        </div>
      </div>
      <Button type="submit" :disabled="!photosStore.pendingPhotos.length || photosStore.isLoading">Добавить</Button>
    </form>
  </Overlay>
</template>

<script setup>
import { X } from "lucide-vue-next";
import Button from "./ui/PrimaryButton.vue";
import Overlay from "./ui/Overlay.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useAppStore } from "@/stores/useAppStore";
import { usePhotosStore } from "@/stores/usePhotosStore";
import { usePetsStore } from "@/stores/usePetsStore";

const appStore = useAppStore();
const photosStore = usePhotosStore();
const petsStore = usePetsStore();

const fileInput = ref(null);

const dropzoneText = computed(() => {
  return appStore.isDesktop ? "Перетащите сюда фото или кликните для выбора" : "Нажмите для выбора фото";
});

const handleCloseForm = () => {
  photosStore.clearPendingPhotos();
  appStore.isPhotoFormOpen = false;
};

const handleFileEvent = (event) => {
  const files = event.dataTransfer ? Array.from(event.dataTransfer.files) : Array.from(event.target.files);
  photosStore.preparePhotos(files);
};

const handleSubmit = async () => {
  await photosStore.submitPending(petsStore.selectedPet.id);
  handleCloseForm();
};

const handleEscape = (e) => {
  if (e.key === "Escape" && appStore.isPhotoFormOpen) {
    handleCloseForm();
  }
};

onMounted(() => window.addEventListener("keyup", handleEscape));
onUnmounted(() => window.removeEventListener("keyup", handleEscape));
</script>
