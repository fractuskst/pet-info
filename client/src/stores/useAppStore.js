import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const isPetFormOpen = ref(false);
  const isPhotoFormOpen = ref(false);
  const isMainPhotoModalOpen = ref(false);

  const isDesktop = computed(() => window.innerWidth >= 768);

  return { isPetFormOpen, isPhotoFormOpen, isMainPhotoModalOpen, isDesktop };
});
