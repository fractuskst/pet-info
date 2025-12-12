import { useToast } from "vue-toastification";

const toast = useToast();

const handleClientError = (err, fallback) => {
  if (!err.status) return toast.error("Сервер недоступен");

  if (err.status >= 500) return toast.error("Внутренняя ошибка сервера");

  return toast.error(err.message || fallback);
};

export default handleClientError;
