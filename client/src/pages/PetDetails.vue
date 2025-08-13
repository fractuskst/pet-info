<template>
  <div v-if="hasPetInfo" class="flex flex-col gap-5 w-full md:w-xl mx-auto">
    <div class="flex flex-col gap-5">
      <h2 class="self-center font-semibold">Подробнее о питомце</h2>
      <div class="flex flex-col gap-3">
        <InfoRow
          v-for="info in filteredPetInfo"
          :key="info.label"
          :label="info.label"
          :value="info.value"
        />
      </div>
    </div>

    <div class="flex flex-col gap-5">
      <h2 class="self-center font-semibold">
        {{ pet.additionalPhotos ? "Дополнительные фото" : "Фотографий нет :(" }}
      </h2>
      <div class="grid grid-cols-4 gap-4">
        <img
          v-for="(photo, index) in pet.additionalPhotos"
          :src="photo"
          :alt="`Фото ${pet.name}`"
          class="rounded-xl cursor-pointer"
          @click="showLightBox(index)"
        />
      </div>
    </div>
  </div>

  <p v-else class="text-center font-semibold p-16">Данных о питомце нет :(</p>

  <vue-easy-lightbox
    :visible="visibleRef"
    :imgs="pet.additionalPhotos"
    :index="indexRef"
    @hide="onHide"
  />
</template>

<script setup>
import InfoRow from "@/components/InfoRow.vue";
import VueEasyLightbox from "vue-easy-lightbox";
import { computed, ref } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const storedPet = localStorage.getItem(`pet_${props.id}`);

const pet = JSON.parse(storedPet);

const formattedBirthDate = computed(() => {
  if (!pet.birthDate) return null;

  const date = new Date(pet.birthDate);
  return date.toLocaleDateString();
});

const petInfo = ref([
  {
    label: "Кличка",
    value: pet.name,
  },
  {
    label: "Хозяин",
    value: pet.owner,
  },
  {
    label: "Дата рождения",
    value: formattedBirthDate,
  },
  {
    label: "Возраст",
    value: pet.age,
  },
  {
    label: "Порода",
    value: pet.breed,
  },
  {
    label: "Любимые игрушки",
    value: pet.favToys,
  },
  {
    label: "Описание",
    value: pet.description,
  },
]);

const filteredPetInfo = computed(() =>
  petInfo.value.filter((info) => info.value),
);
const hasPetInfo = computed(() => filteredPetInfo.value.length > 0);

const visibleRef = ref(false);
const indexRef = ref(0);

const showLightBox = (index) => {
  indexRef.value = index;
  visibleRef.value = true;
};

const onHide = () => {
  visibleRef.value = false;
};
</script>
