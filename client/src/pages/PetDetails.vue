<template>
  <Spinner v-if="isLoading" class="self-center p-16" />

  <div v-else class="flex flex-col gap-5 w-full md:w-xl mx-auto">
    <div class="flex justify-between">
      <Button @click="router.push('/')">Назад</Button>
      <div>
        <Button @click="isFormOpen = true">ред.</Button>
        <Button @click="handleDeletePet">удалить</Button>
      </div>
    </div>

    <div v-if="hasPetInfo" class="flex flex-col gap-5">
      <h2 class="text-center font-semibold">Подробнее о питомце</h2>
      <div class="flex flex-col gap-3">
        <InfoRow
          v-for="info in filteredPetInfo"
          :key="info.label"
          :label="info.label"
          :value="info.value"
        />
      </div>
    </div>

    <!-- <div class="flex flex-col gap-5">
      <h2 class="self-center font-semibold">
        {{ pet.additionalPhotos ? "Дополнительные фото" : "Фотографий нет :(" }}
      </h2>
      <div class="grid grid-cols-4 gap-4">
        <img
          v-for="(photo, index) in pet.additionalPhotos"
          :src="photo"
          :alt="`Фото ${pet.name}`"
          class="rounded-xl cursor-pointer"
          @click="handleShowLightBox(index)"
        />
      </div>
    </div> -->

    <p v-else class="text-center font-semibold pb-10">
      Данных о питомце нет :(
    </p>
  </div>

  <PetForm
    v-model:isOpen="isFormOpen"
    :selected-pet="pet"
    @pet-updated="handlePetUpdated"
  />
  <!-- <vue-easy-lightbox
    :visible="visibleRef"
    :imgs="pet.additionalPhotos"
    :index="indexRef"
    @hide="handleHideLightBox"
  /> -->
</template>

<script setup>
import InfoRow from "@/components/InfoRow.vue";
import VueEasyLightbox from "vue-easy-lightbox";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "@/components/ui/Button.vue";
import Spinner from "@/components/ui/Spinner.vue";
import PetForm from "@/components/PetForm.vue";
import { getPet, deletePet } from "@/services/petService";
import { useToast } from "vue-toastification";

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
const isFormOpen = ref(false);

const visibleRef = ref(false);
const indexRef = ref(0);

onMounted(async () => {
  try {
    pet.value = await getPet(id);
  } catch (err) {
    toast.error("Ошибка загрузки питомца:", err.message);
  } finally {
    isLoading.value = false;
  }
});

const handleDeletePet = async () => {
  try {
    await deletePet(id);
    toast.success("Питомец успешно удален!");
  } catch (err) {
    toast.error("Ошибка удаления питомца:", err.message);
  }
  router.push("/");
};

const handlePetUpdated = (updatedPet) => {
  pet.value = updatedPet;
};

const formattedBirthDate = computed(() => {
  if (!pet.value?.birthDate) return null;
  const date = new Date(pet.value.birthDate);
  return date.toLocaleDateString();
});

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
    label: "Хозяин",
    value: pet.value?.owner,
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

const filteredPetInfo = computed(() =>
  petInfo.value.filter((info) => info.value),
);

const hasPetInfo = computed(() =>
  filteredPetInfo.value.some(
    (info) => info.label !== "Кличка" && info.label !== "Вид",
  ),
);

const handleShowLightBox = (index) => {
  indexRef.value = index;
  visibleRef.value = true;
};

const handleHideLightBox = () => {
  visibleRef.value = false;
};
</script>
