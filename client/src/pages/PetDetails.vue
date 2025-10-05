<template>
  <Spinner v-if="isLoading" class="self-center p-16" />

  <div v-else class="flex flex-col gap-5 w-full md:w-xl mx-auto">
    <div class="flex justify-between">
      <Button :icon="Undo" @click="router.push('/')" />
      <div class="flex gap-1 flex-nowrap">
        <Button v-if="hasPetInfo" @click="isOpenEditForm = true" :icon="Pencil" />
        <Button @click="handleDeletePet" :icon="Trash2" />
      </div>
    </div>

    <div v-if="hasPetInfo" class="flex flex-col gap-5">
      <h2 class="text-center font-semibold">Подробнее о питомце</h2>
      <div class="flex flex-col gap-3">
        <InfoRow v-for="info in filteredPetInfo" :key="info.label" :label="info.label" :value="info.value" />
      </div>
    </div>
    <div class="flex flex-col items-center gap-5" v-else>
      <p class="text-center font-semibold">Данных о питомце нет :(</p>
      <Button @click="isOpenEditForm = true" :icon="Pencil">Редактировать</Button>
    </div>

    <div class="flex flex-col gap-5 mt-8">
      <h2 class="self-center font-semibold">
        {{ photos.length ? "Дополнительные фото" : "Фотографий нет :(" }}
      </h2>
      <div v-if="photos.length" class="grid grid-cols-5 gap-4">
        <div v-for="(photo, index) in photos" :key="photo.id" class="relative">
          <img
            :src="photo.url"
            :alt="`Фото ${pet.name}`"
            class="relative w-25 h-35 object-cover rounded border border-gray-200 cursor-pointer"
            @click="handleShowLightBox(index)"
          />
          <X
            class="absolute top-1 right-1 stroke-gray-700 size-5 cursor-pointer hover:stroke-gray-800"
            @click="handleRemovePhoto(photo.url)"
          />
        </div>
      </div>
      <Button
        v-if="photos.length < MAX_PHOTOS_PER_PET"
        @click="isOpenPhotoForm = true"
        class="self-center"
        :icon="ImageUp"
        >Добавить</Button
      >
    </div>
  </div>

  <PetForm v-model:isOpen="isOpenEditForm" :selected-pet="pet" @pet-updated="handlePetUpdated" />
  <PhotoForm
    v-model:isOpen="isOpenPhotoForm"
    :pet-id="id"
    :current-photo-count="photos.length"
    @photo-uploaded="handlePhotoUploaded"
  />
  <vue-easy-lightbox
    :visible="visibleRef"
    :imgs="photos.map((p) => p.url)"
    :index="indexRef"
    @hide="handleHideLightBox"
  />
</template>

<script setup>
import InfoRow from "@/components/InfoRow.vue";
import VueEasyLightbox from "vue-easy-lightbox";
import { Undo, Pencil, Trash2, ImageUp, X } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "@/components/ui/Button.vue";
import Spinner from "@/components/ui/Spinner.vue";
import PetForm from "@/components/PetForm.vue";
import { getPhotos, deletePhoto, getPet, deletePet } from "@/services/petService";
import { useToast } from "vue-toastification";
import PhotoForm from "@/components/PhotoForm.vue";
import { MAX_PHOTOS_PER_PET } from "../../../constants";

const router = useRouter();

const { id } = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const toast = useToast();

const isLoading = ref(true);
const pet = ref(null);
const photos = ref([]);

const isOpenEditForm = ref(false);
const isOpenPhotoForm = ref(false);

const visibleRef = ref(false);
const indexRef = ref(0);

onMounted(async () => {
  try {
    pet.value = await getPet(id);
    photos.value = await getPhotos(id);
  } catch (err) {
    if (err && pet.value === null) {
      router.replace("/");
    }
    toast.error(`Ошибка загрузки данных: ${err.message}`);
  } finally {
    isLoading.value = false;
  }
});

const handleDeletePet = async () => {
  try {
    await deletePet(id);
    toast.success("Питомец успешно удален!");
  } catch (err) {
    toast.error(`Ошибка удаления питомца: ${err.message}`);
  }
  router.push("/");
};

const handlePetUpdated = (updatedPet) => {
  pet.value = updatedPet;
};

const handlePhotoUploaded = (uploadedPhoto) => {
  photos.value = [...photos.value, ...uploadedPhoto];
};

const formattedBirthDate = computed(() => {
  if (!pet.value?.birthDate) return null;
  const date = new Date(pet.value.birthDate);
  return date.toLocaleDateString();
});

const handleRemovePhoto = async (url) => {
  try {
    await deletePhoto(id, url);
    photos.value = photos.value.filter((photo) => photo.url !== url);
    toast.success("Фотография успешно удалена!");
  } catch (err) {
    toast.error(`Ошибка удаления фотографии: ${err.message}`);
  }
};

const petInfo = computed(() => [
  {
    label: "Кличка",
    value: pet.value?.name,
  },
  {
    label: "Вид",
    value: pet.value?.type,
  },
  {
    label: "Дата рождения",
    value: formattedBirthDate.value,
  },
  {
    label: "Возраст",
    value: pet.value?.age,
  },
  {
    label: "Порода",
    value: pet.value?.breed,
  },
  {
    label: "Любимые игрушки",
    value: pet.value?.favToys,
  },
  {
    label: "Описание",
    value: pet.value?.description,
  },
]);

const filteredPetInfo = computed(() => petInfo.value.filter((info) => info.value));

const hasPetInfo = computed(() =>
  filteredPetInfo.value.some((info) => info.label !== "Кличка" && info.label !== "Вид"),
);

const handleShowLightBox = (index) => {
  indexRef.value = index;
  visibleRef.value = true;
};

const handleHideLightBox = () => {
  visibleRef.value = false;
};
</script>
