import { createApp } from "vue";
import App from "./App.vue";
import "./main.css";
import "vue-toastification/dist/index.css";
import Toast, { POSITION } from "vue-toastification";
import router from "./router";

const app = createApp(App);

app.use(Toast, {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 2000,
});
app.use(router);
app.mount("#app");
