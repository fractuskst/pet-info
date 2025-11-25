<template>
  <div class="grid grid-cols-5 gap-4">
    <div v-for="(photo, index) in photosStore.photos" :key="photo.id" class="relative">
      <img
        :src="photo.url"
        alt="Фото питомца"
        class="w-full h-35 object-cover rounded border border-gray-200 cursor-pointer"
        @click="onPhotoClick(photo, index)"
      />
      <X
        v-if="removable"
        class="absolute top-1 right-1 stroke-gray-700 size-5 cursor-pointer hover:stroke-gray-800"
        @click.stop="onXClick(photo.url)"
      />
    </div>
  </div>
</template>

<script setup>
import { usePhotosStore } from "@/stores/photos";
import { X } from "lucide-vue-next";

defineProps({
  removable: { type: Boolean, default: false },
  onXClick: { type: Function, required: false },
  onPhotoClick: { type: Function, required: true },
});

const photosStore = usePhotosStore();
</script>
