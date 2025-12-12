import * as photoService from "@/services/photo.service";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useToast } from "vue-toastification";
import { MAX_PHOTOS_PER_PET } from "../../../shared/constants";
import handleClientError from "@/utils/handleClientError";

const toast = useToast();

export const usePhotosStore = defineStore("photos", () => {
  const photos = ref([]);
  const pendingPhotos = ref([]);
  const previewUrls = ref([]);
  const isLoading = ref(false);

  const photosCount = computed(() => photos.value.length);
  const pendingPhotosCount = computed(() => pendingPhotos.value.length);
  const freeSlots = computed(() => MAX_PHOTOS_PER_PET - (photosCount.value + pendingPhotosCount.value));

  const getPhotos = async (petId) => {
    isLoading.value = true;
    try {
      const fetchedPhotos = await photoService.getPhotos(petId);
      photos.value = fetchedPhotos;
    } catch (err) {
      handleClientError(err, "Ошибка загрузки фотографий");
    } finally {
      isLoading.value = false;
    }
  };

  const uploadPhotos = async (petId, formData) => {
    isLoading.value = true;
    try {
      const newPhotos = await photoService.uploadPhotos(petId, formData);
      photos.value.push(...newPhotos);
      toast.success("Фотографии успешно добавлены!");
    } catch (err) {
      handleClientError(err, "Ошибка при добавлении фотографий");
    } finally {
      isLoading.value = false;
    }
  };

  const deletePhoto = async (petId, url) => {
    isLoading.value = true;
    try {
      await photoService.deletePhoto(petId, url);
      photos.value = photos.value.filter((photo) => photo.url !== url);
      toast.success("Фотография успешно удалена!");
    } catch (err) {
      handleClientError(err, "Ошибка удаления фотографии");
    } finally {
      isLoading.value = false;
    }
  };

  const preparePhotos = (files) => {
    const valid = files.filter((f) => f.type.startsWith("image/")).slice(0, freeSlots.value);
    const urls = valid.map((f) => URL.createObjectURL(f));
    pendingPhotos.value.push(...valid);
    previewUrls.value.push(...urls);
  };

  const removePreparedPhoto = (index) => {
    URL.revokeObjectURL(previewUrls.value[index]);
    pendingPhotos.value.splice(index, 1);
    previewUrls.value.splice(index, 1);
  };

  const clearPendingPhotos = () => {
    previewUrls.value.forEach(URL.revokeObjectURL);
    pendingPhotos.value = [];
    previewUrls.value = [];
  };

  const submitPending = async (petId) => {
    const formData = new FormData();
    pendingPhotos.value.forEach((photo) => formData.append("photos", photo));
    await uploadPhotos(petId, formData);
  };

  return {
    photos,
    pendingPhotos,
    previewUrls,
    photosCount,
    pendingPhotosCount,
    freeSlots,
    isLoading,
    getPhotos,
    uploadPhotos,
    deletePhoto,
    preparePhotos,
    removePreparedPhoto,
    clearPendingPhotos,
    submitPending,
  };
});
