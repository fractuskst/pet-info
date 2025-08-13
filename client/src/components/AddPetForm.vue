<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/70 flex items-start justify-center z-50 overflow-y-auto"
    @click.self="closeForm"
  >
    <form
      class="flex flex-col gap-2 bg-white p-6 rounded-xl w-full max-w-md my-auto"
    >
      <h2 class="self-center font-semibold">Добавление питомца</h2>
      <div class="flex flex-col gap-1" v-for="input in inputs" :key="input.id">
        <label :for="input.id">{{ input.label }}</label>
        <input
          class="outline-none text-sm border border-gray-400 rounded-xl p-2 focus:border-gray-500"
          :type="input.type"
          :id="input.id"
          :placeholder="input.placeholder"
          v-model="input.value"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="description">Описание</label>
        <textarea
          class="resize-none outline-none h-20 text-sm border border-gray-400 rounded-xl p-2 focus:border-gray-500"
          id="description"
          placeholder="Расскажите подробнее о своем питомце"
          v-model="description"
        ></textarea>
      </div>

      <button
        class="outline-none bg-green-300 text-white p-2 rounded-xl cursor-pointer transition duration-200 hover:opacity-90 focus:border focus:border-green-500"
        type="submit"
        @click.prevent="handleSubmit"
      >
        Добавить
      </button>
    </form>
  </div>
</template>

<script setup>
import calculateAge from "@/utils/calculateAge";
import getTimestamp from "@/utils/getTimestamp";
import { ref, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  isOpen: Boolean,
  pets: Array,
});

const emit = defineEmits(["update:isOpen", "update:pets"]);

const closeForm = () => {
  emit("update:isOpen", false);
};

const toggleBodyScroll = () => {
  if (props.isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

const handleEscape = (e) => {
  if (e.key === "Escape" && props.isOpen) {
    closeForm();
  }
};

const resetForm = () => {
  inputs.value.forEach((input) => (input.value = ""));
  description.value = "";
};

const formatAge = (years, months) => {
  if (months) {
    return `${years}.${months}`;
  }
  return `${years}`;
};

const handleSubmit = () => {
  const birthDateInput = inputs.value.find((input) => input.id === "birthDate");
  const birthTimeStamp = getTimestamp(birthDateInput.value);

  const values = inputs.value.map((input) => {
    return [input.id, input.id === "birthDate" ? birthTimeStamp : input.value];
  });

  const { years, months } = calculateAge(birthTimeStamp);

  const formData = {
    ...Object.fromEntries(values),
    age: birthTimeStamp ? formatAge(years, months) : null,
    description: description.value,
  };
  closeForm();

  emit("update:pets", [...props.pets, formData]);

  console.log(formData);
};

watch(
  () => props.isOpen,
  (isOpen) => {
    toggleBodyScroll();
    if (!isOpen) {
      resetForm();
    }
  },
);

onMounted(() => window.addEventListener("keyup", handleEscape));
onUnmounted(() => window.removeEventListener("keyup", handleEscape));

const inputs = ref([
  {
    id: "name",
    type: "text",
    label: "Кличка",
    placeholder: "Введите кличку питомца",
    value: "",
  },
  {
    id: "type",
    type: "text",
    label: "Вид животного",
    placeholder: "Введите вид животного (кошка, собака и т.д)",
    value: "",
  },
  {
    id: "owner",
    type: "text",
    label: "Хозяин",
    placeholder: "Введите имя хозяина",
    value: "",
  },
  {
    id: "birthDate",
    type: "date",
    label: "Дата рождения",
    value: "",
  },
  {
    id: "breed",
    type: "text",
    label: "Порода",
    placeholder: "Введите породу питомца",
    value: "",
  },
  {
    id: "favToys",
    type: "text",
    label: "Любимые игрушки",
    placeholder: "Введите любимые игрушки питомца",
    value: "",
  },

  {
    id: "mainPhoto",
    type: "text",
    label: "Фото",
    placeholder: "Введите URL главного фото",
    value: "",
  },
]);

const description = ref("");
</script>
