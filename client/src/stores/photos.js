import { deletePhoto, getPhotos, uploadPhotos } from "@/services/photoService";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useToast } from "vue-toastification";
import { MAX_PHOTOS_PER_PET } from "../../../shared/constants";

const toast = useToast();

export const usePhotosStore = defineStore("photos", () => {
  const photos = ref([]);
  const pendingPhotos = ref([]);
  const previewUrls = ref([]);

  const photosCount = computed(() => photos.value.length);
  const pendingPhotosCount = computed(() => pendingPhotos.value.length);
  const freeSlots = computed(() => MAX_PHOTOS_PER_PET - (photosCount.value + pendingPhotosCount.value));

  async function fetchPhotos(petId) {
    try {
      const data = await getPhotos(petId);
      photos.value = data;
    } catch (err) {
      toast.error(`Ошибка загрузки фотографий: ${err.message}`);
    }
  }

  async function addPhotos(petId, formData) {
    try {
      const newPhotos = await uploadPhotos(petId, formData);
      photos.value.push(...newPhotos);
      toast.success("Фотографии успешно добавлены!");
    } catch (err) {
      toast.error(`Ошибка при добавлении фотографий: ${err.message}`);
    }
  }

  async function removePhoto(petId, url) {
    try {
      await deletePhoto(petId, url);
      photos.value = photos.value.filter((photo) => photo.url !== url);
      toast.success("Фотография успешно удалена!");
    } catch (err) {
      toast.error(`Ошибка удаления фотографии: ${err.message}`);
    }
  }

  function preparePhotos(files) {
    const valid = files.filter((f) => f.type.startsWith("image/")).slice(0, freeSlots.value);
    const urls = valid.map((f) => URL.createObjectURL(f));
    pendingPhotos.value.push(...valid);
    previewUrls.value.push(...urls);
  }

  function removePreparedPhoto(index) {
    URL.revokeObjectURL(previewUrls.value[index]);
    pendingPhotos.value.splice(index, 1);
    previewUrls.value.splice(index, 1);
  }

  function clearPendingPhotos() {
    previewUrls.value.forEach(URL.revokeObjectURL);
    pendingPhotos.value = [];
    previewUrls.value = [];
  }

  async function submitPending(petId) {
    const formData = new FormData();
    pendingPhotos.value.forEach((p) => formData.append("photos", p));
    await addPhotos(petId, formData);
  }

  return {
    photos,
    pendingPhotos,
    previewUrls,
    photosCount,
    pendingPhotosCount,
    freeSlots,
    fetchPhotos,
    addPhotos,
    removePhoto,
    preparePhotos,
    removePreparedPhoto,
    clearPendingPhotos,
    submitPending,
  };
});
