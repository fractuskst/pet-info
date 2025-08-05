<template>
  <div class="flex flex-col gap-5 w-full md:w-xl mx-auto">
    <div class="flex flex-col gap-5">
      <h2 class="self-center font-semibold">Подробнее о питомце</h2>
      <div class="flex flex-col gap-3">
        <InfoRow label="Кличка" :value="pet.name" />
        <InfoRow label="Хозяин" :value="pet.owner" />
        <InfoRow label="Дата рождения" :value="pet.birthDate" />
        <InfoRow label="Возраст" :value="pet.age" />
        <InfoRow label="Порода" :value="pet.breed" />
        <InfoRow label="Любимые игрушки" :value="pet.favToys" />
        <InfoRow label="Описание" :value="pet.description" />
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
import { pets } from "@/constants";
import { ref } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const pet = pets.find((pet) => pet.id === Number(props.id));

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
