<template>
  <button
    :class="[
      customClass,
      'outline-none text-white p-2 cursor-pointer transition duration-200 hover:opacity-90 focus:border disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:opacity-100',
    ]"
  >
    <div class="flex gap-2 items-center justify-center">
      <component v-if="icon" :is="icon" class="w-5 h-5" />
      <slot></slot>
    </div>
  </button>
</template>

<script setup>
defineProps({
  icon: {
    type: Function,
    required: false,
  },
  customClass: {
    type: String,
    default: "bg-green-300 border rounded-xl focus:border-green-500",
  },
});
</script>
