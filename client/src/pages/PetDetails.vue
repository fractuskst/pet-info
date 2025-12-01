<template>
  <Spinner v-if="petsStore.isLoading" class="self-center p-16" />

  <div v-else class="flex flex-col gap-5 w-full md:w-xl mx-auto">
    <div class="flex justify-between">
      <Button :icon="Undo" @click="router.push('/')" />
      <div class="flex gap-1 flex-nowrap">
        <Button v-if="hasPetInfo" @click="handleOpenPetForm" :icon="Pencil" />
        <Button @click="handleRemovePet" :icon="Trash2" />
      </div>
    </div>

    <div v-if="hasPetInfo" class="flex flex-col gap-5">
      <h2 class="text-center font-semibold">Подробнее о питомце</h2>
      <div class="flex flex-col gap-3">
        <InfoRow v-for="info in filteredPetInfo" :key="info.label" :label="info.label" :value="info.value" />
      </div>
    </div>
    <div v-else class="flex flex-col items-center gap-5">
      <p class="text-center font-semibold">Данных о питомце нет :(</p>
      <Button @click="handleOpenPetForm">Редактировать</Button>
    </div>

    <div class="flex flex-col gap-5 mt-8">
      <h2 class="self-center font-semibold">
        {{ photosStore.photosCount ? "Фотографии" : "Фотографий нет :(" }}
      </h2>

      <PhotosGrid
        v-if="photosStore.photosCount"
        removable
        :onPhotoClick="(_, index) => handleShowLightBox(index)"
        :onXClick="handleRemovePhoto"
      />
      <Button
        v-if="photosStore.photosCount < MAX_PHOTOS_PER_PET"
        @click="handleOpenPhotoForm"
        class="self-center"
        :icon="ImageUp"
        >Добавить</Button
      >
    </div>
  </div>

  <PetForm />
  <PhotoForm />

  <vue-easy-lightbox
    :visible="visibleRef"
    :imgs="photosStore.photos.map((p) => p.url)"
    :index="indexRef"
    @hide="handleHideLightBox"
    moveDisabled
  />
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import InfoRow from "@/components/InfoRow.vue";
import Button from "@/components/ui/PrimaryButton.vue";
import Spinner from "@/components/ui/Spinner.vue";
import PetForm from "@/components/PetForm.vue";
import PhotoForm from "@/components/PhotoForm.vue";
import PhotosGrid from "@/components/PhotosGrid.vue";
import VueEasyLightbox from "vue-easy-lightbox";
import { Undo, Pencil, Trash2, ImageUp } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { MAX_PHOTOS_PER_PET } from "../../../shared/constants";
import { usePetsStore } from "@/stores/pets";
import { usePhotosStore } from "@/stores/photos";
import { useAppStore } from "@/stores/app";

const petsStore = usePetsStore();
const photosStore = usePhotosStore();
const appStore = useAppStore();
const router = useRouter();

const { id } = defineProps({
  id: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  petsStore.fetchPet(id);
  photosStore.fetchPhotos(id);
});

onUnmounted(() => {
  petsStore.selectedPet = null;
  photosStore.photos = [];
});

const visibleRef = ref(false);
const indexRef = ref(0);

const handleOpenPetForm = () => {
  appStore.isPetFormOpen = true;
};

const handleOpenPhotoForm = () => {
  appStore.isPhotoFormOpen = true;
};

const handleRemovePet = async () => {
  await petsStore.removePet(id);
  router.push("/");
};

const handleRemovePhoto = (url) => {
  photosStore.removePhoto(id, url);

  if (petsStore.selectedPet.mainPhoto === url) {
    petsStore.editPet({ mainPhoto: null });
  }
};

const handleShowLightBox = (index) => {
  indexRef.value = index;
  visibleRef.value = true;
};

const handleHideLightBox = () => {
  visibleRef.value = false;
};

const formattedBirthDate = computed(() => {
  if (!petsStore.selectedPet?.birthDate) return null;
  const date = new Date(petsStore.selectedPet.birthDate);
  return date.toLocaleDateString();
});

const petInfo = computed(() => [
  {
    label: "Кличка",
    value: petsStore.selectedPet?.name,
  },
  {
    label: "Вид",
    value: petsStore.selectedPet?.type,
  },
  {
    label: "Дата рождения",
    value: formattedBirthDate.value,
  },
  {
    label: "Возраст",
    value: petsStore.selectedPet?.age,
  },
  {
    label: "Порода",
    value: petsStore.selectedPet?.breed,
  },
  {
    label: "Любимые игрушки",
    value: petsStore.selectedPet?.favToys,
  },
  {
    label: "Описание",
    value: petsStore.selectedPet?.description,
  },
]);

const filteredPetInfo = computed(() => petInfo.value.filter((info) => info.value));

const hasPetInfo = computed(() =>
  filteredPetInfo.value.some((info) => info.label !== "Кличка" && info.label !== "Вид"),
);
</script>
