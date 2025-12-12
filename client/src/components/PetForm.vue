<template>
  <Overlay v-if="appStore.isPetFormOpen" @mousedown.self="handleCloseForm">
    <form
      class="relative flex flex-col gap-2 bg-white p-6 rounded-xl w-full max-w-md my-auto"
      @submit.prevent="handleSubmit"
    >
      <h2 class="self-center font-semibold">
        {{ petsStore.selectedPet ? "Редактирование питомца" : "Добавление питомца" }}
      </h2>

      <X
        class="absolute stroke-gray-500 size-5 right-5 cursor-pointer hover:stroke-gray-600"
        @click="handleCloseForm"
      />

      <div class="flex flex-col gap-1" v-for="field in formFields" :key="field.id">
        <label :for="field.id">{{ field.label }}</label>
        <input
          class="outline-none text-sm border border-gray-400 rounded-xl p-2 focus:border-gray-500"
          v-if="field.type !== 'textarea'"
          :type="field.type"
          :id="field.id"
          :placeholder="field.placeholder"
          v-model="formData[field.id]"
        />
        <textarea
          class="resize-none outline-none h-20 text-sm border border-gray-400 rounded-xl p-2 focus:border-gray-500"
          v-else
          :id="field.id"
          :placeholder="field.placeholder"
          v-model="formData[field.id]"
        ></textarea>
      </div>

      <Button type="submit" :disabled="petsStore.isLoading">{{
        petsStore.selectedPet ? "Подтвердить изменения" : "Добавить"
      }}</Button>
    </form>
  </Overlay>
</template>

<script setup>
import { reactive, watch, onMounted, onUnmounted } from "vue";
import Button from "./ui/PrimaryButton.vue";
import Overlay from "./ui/Overlay.vue";
import { X } from "lucide-vue-next";
import { usePetsStore } from "@/stores/usePetsStore";
import { useAppStore } from "@/stores/useAppStore";
import prepareFormData from "@/utils/prepareFormData";

const petsStore = usePetsStore();
const appStore = useAppStore();

const handleCloseForm = () => {
  appStore.isPetFormOpen = false;
};

const formFields = [
  {
    id: "name",
    label: "Кличка",
    type: "text",
    placeholder: "Введите кличку питомца",
  },
  {
    id: "type",
    label: "Вид",
    type: "text",
    placeholder: "Введите вид животного (кошка, собака и т.д)",
  },
  { id: "birthDate", label: "Дата рождения", type: "date", placeholder: "" },
  {
    id: "breed",
    label: "Порода",
    type: "text",
    placeholder: "Введите породу питомца",
  },
  {
    id: "favToys",
    label: "Любимые игрушки",
    type: "text",
    placeholder: "Введите любимые игрушки питомца",
  },
  {
    id: "description",
    label: "Описание",
    type: "textarea",
    placeholder: "Расскажите подробнее о своем питомце",
  },
];

const formData = reactive(Object.fromEntries(formFields.map((f) => [f.id, ""])));

const populateForm = (pet) => {
  Object.keys(formData).forEach((key) => {
    if (key === "birthDate" && pet.birthDate) {
      const date = new Date(pet.birthDate);
      formData.birthDate = date.toISOString().split("T")[0];
    } else {
      formData[key] = pet[key] || "";
    }
  });
};

const handleEscape = (e) => {
  if (e.key === "Escape" && appStore.isPetFormOpen) {
    handleCloseForm();
  }
};

const handleSubmit = () => {
  const preparedFormData = prepareFormData(formData);

  if (petsStore.selectedPet) {
    petsStore.updatePet(preparedFormData);
  } else {
    petsStore.createPet(preparedFormData);
  }

  handleCloseForm();
};

watch(
  () => appStore.isPetFormOpen,
  (open) => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open && petsStore.selectedPet) {
      populateForm(petsStore.selectedPet);
    } else if (!open) {
      Object.keys(formData).forEach((key) => (formData[key] = ""));
    }
  },
);

onMounted(() => window.addEventListener("keyup", handleEscape));
onUnmounted(() => window.removeEventListener("keyup", handleEscape));
</script>
