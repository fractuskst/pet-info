<template>
  <div
    class="flex items-center justify-between gap-14 sm:gap-25 border-b border-y-green-200 pb-2"
  >
    <p class="text-xs sm:text-sm text-slate-600">{{ label }}</p>
    <p class="text-sm sm:text-base text-right">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
});
</script>
