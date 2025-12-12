const handleServerResponse = async (res) => {
  const contentType = res.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = body?.message || "Неизвестная ошибка";
    const error = new Error(message);
    error.status = res.status;
    error.body = body;
    throw error;
  }

  return body;
};

export default handleServerResponse;
