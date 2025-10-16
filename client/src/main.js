import { createApp } from "vue";
import App from "./App.vue";
import "./main.css";
import "vue-toastification/dist/index.css";
import Toast, { POSITION } from "vue-toastification";
import router from "./router";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(Toast, {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 2500,
});

app.mount("#app");
