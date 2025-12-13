import { createRouter, createWebHistory } from "vue-router";
import PetsPage from "@/pages/PetsPage.vue";
import PetDetailsPage from "@/pages/PetDetailsPage.vue";

const routes = [
  {
    path: "/",
    name: "Pets",
    component: PetsPage,
  },

  {
    path: "/:id",
    name: "PetDetails",
    component: PetDetailsPage,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
