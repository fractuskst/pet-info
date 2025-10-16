import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const isLoading = ref(false);
  const error = ref(null);

  const isPetFormOpen = ref(false);
  const isPhotoFormOpen = ref(false);

  const isDesktop = computed(() => window.innerWidth >= 768);

  return { isLoading, error, isPetFormOpen, isPhotoFormOpen, isDesktop };
});
