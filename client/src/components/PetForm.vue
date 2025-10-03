<template>
  <Overlay v-if="isOpen" @mousedown.self="closeForm">
    <form
      class="relative flex flex-col gap-2 bg-white p-6 rounded-xl w-full max-w-md my-auto"
      @submit.prevent="handleSubmit"
    >
      <h2 class="self-center font-semibold">
        {{ selectedPet ? "Редактирование питомца" : "Добавление питомца" }}
      </h2>

      <X class="absolute stroke-gray-500 size-5 right-5 cursor-pointer hover:stroke-gray-600" @click="closeForm" />

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

      <Button type="submit">{{ selectedPet ? "Подтвердить изменения" : "Добавить" }}</Button>
    </form>
  </Overlay>
</template>

<script setup>
import calculateAge from "@/utils/calculateAge";
import formatAge from "@/utils/formatAge";
import getTimestamp from "@/utils/getTimestamp";
import { reactive, watch, onMounted, onUnmounted } from "vue";
import Button from "./ui/Button.vue";
import Overlay from "./ui/Overlay.vue";
import { X } from "lucide-vue-next";
import { createPet, updatePet } from "@/services/petService";
import { useToast } from "vue-toastification";

const { isOpen, selectedPet } = defineProps({
  isOpen: Boolean,
  selectedPet: Object,
});

const emit = defineEmits(["update:isOpen", "pet-added", "pet-updated"]);

const toast = useToast();

const closeForm = () => {
  emit("update:isOpen", false);
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

const prepareFormData = () => {
  const birthTimeStamp = formData.birthDate ? getTimestamp(formData.birthDate) : null;
  const { years, months } = birthTimeStamp ? calculateAge(birthTimeStamp) : { years: null, months: null };

  return {
    ...formData,
    birthDate: birthTimeStamp,
    age: birthTimeStamp ? formatAge(years, months) : null,
  };
};

const handleSubmit = async () => {
  const preparedFormData = prepareFormData();

  try {
    let result;
    if (selectedPet) {
      result = await updatePet(selectedPet.id, preparedFormData);
      emit("pet-updated", result);
      toast.success("Питомец успешно обновлен!");
    } else {
      result = await createPet(preparedFormData);
      emit("pet-added", result);
      toast.success("Питомец успешно добавлен!");
    }
    closeForm();
  } catch (err) {
    toast.error(`${selectedPet ? "Ошибка обновления питомца: " : "Ошибка создания питомца: "} ${err.message}`);
  }
};

watch(
  () => isOpen,
  (open) => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open && selectedPet) {
      populateForm(selectedPet);
    } else if (!open) {
      Object.keys(formData).forEach((key) => (formData[key] = ""));
    }
  },
);

const handleEscape = (e) => {
  if (e.key === "Escape" && isOpen) {
    closeForm();
  }
};

onMounted(() => window.addEventListener("keyup", handleEscape));
onUnmounted(() => window.removeEventListener("keyup", handleEscape));
</script>
