import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/HomePage.vue";
import PetDetails from "@/pages/PetDetails.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },

  {
    path: "/:id",
    name: "PetDetails",
    component: PetDetails,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
