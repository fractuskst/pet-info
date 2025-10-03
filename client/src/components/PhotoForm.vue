<template>
  <Overlay v-if="isOpen" @mousedown.self="closeForm">
    <form
      class="relative flex flex-col gap-2 bg-white p-6 rounded-xl w-full max-w-md my-auto"
      @submit.prevent="handleSubmit"
    >
      <h2 class="self-center font-semibold">Добавление фото</h2>

      <X class="absolute stroke-gray-500 size-5 right-5 cursor-pointer hover:stroke-gray-600" @click="closeForm" />

      <div
        class="border-dashed border-2 border-gray-300 rounded p-10 text-center cursor-pointer hover:border-gray-500 transition-colors"
        @drop.prevent="isDesktop && handleDropImage($event)"
        @dragover.prevent
        @click="fileInput.click()"
      >
        <p class="text-gray-500">
          {{ isDesktop ? "Перетащите сюда фото или кликните для выбора" : "Нажмите для выбора фото" }}
        </p>
        <p class="text-gray-500">
          Можно добавить ещё {{ MAX_PHOTOS_PER_PET - (currentPhotoCount + selectedFiles.length) }} фото
        </p>
        <input ref="fileInput" type="file" multiple accept="image/*" class="hidden" @change="handleFilesChange" />
      </div>

      <div v-if="previewImages.length" class="flex justify-center flex-wrap gap-2 mt-2">
        <div v-for="(img, index) in previewImages" :key="img.toString()" class="relative">
          <img :src="img" class="w-18 h-18 object-cover rounded" />
          <X
            class="absolute top-0 right-0 stroke-gray-500 size-5 cursor-pointer hover:stroke-gray-600"
            @click="handleRemoveImage(index)"
          />
        </div>
      </div>

      <Button type="submit" :disabled="isUploading || selectedFiles.length === 0">Добавить</Button>
    </form>
  </Overlay>
</template>

<script setup>
import { X } from "lucide-vue-next";
import Button from "./ui/Button.vue";
import Overlay from "./ui/Overlay.vue";
import { computed, ref } from "vue";
import { useToast } from "vue-toastification";
import { uploadPhotos } from "@/services/petService";

const MAX_PHOTOS_PER_PET = 10;

const props = defineProps({
  isOpen: Boolean,
  petId: String,
  currentPhotoCount: Number,
});

const emit = defineEmits(["update:isOpen", "photo-uploaded"]);

const toast = useToast();

const selectedFiles = ref([]);
const previewImages = ref([]);
const fileInput = ref(null);
const isUploading = ref(false);

const isDesktop = computed(() => window.innerWidth >= 768);

const closeForm = () => {
  previewImages.value.forEach(URL.revokeObjectURL);
  emit("update:isOpen", false);
  selectedFiles.value = [];
  previewImages.value = [];
};

const addFiles = (files) => {
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));
  const freeSlots = MAX_PHOTOS_PER_PET - (props.currentPhotoCount + selectedFiles.value.length);
  const filesToAdd = imageFiles.slice(0, freeSlots);

  selectedFiles.value.push(...filesToAdd);

  const newPreviews = filesToAdd.map((image) => URL.createObjectURL(image));
  previewImages.value.push(...newPreviews);
};

const handleFilesChange = (event) => {
  const files = Array.from(event.target.files);
  addFiles(files);
};

const handleDropImage = (event) => {
  const files = Array.from(event.dataTransfer.files);
  addFiles(files);
};

const handleRemoveImage = (index) => {
  URL.revokeObjectURL(previewImages.value[index]);
  selectedFiles.value.splice(index, 1);
  previewImages.value.splice(index, 1);
};

const handleSubmit = async () => {
  const formData = new FormData();
  selectedFiles.value.forEach((file) => formData.append("photos", file));

  try {
    isUploading.value = true;
    const uploadedPhotos = await uploadPhotos(props.petId, formData);
    emit("photo-uploaded", uploadedPhotos);
    toast.success("Фото успешно добавлены!");
    closeForm();
  } catch (err) {
    toast.error(`Не удалось загрузить фотографии: ${err.message}`);
  } finally {
    isUploading.value = false;
  }
};
</script>
