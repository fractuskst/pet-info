const defaultHeaders = {
  "Content-Type": "application/json",
};

const request = async (url, options = {}) => {
  const headers = { ...defaultHeaders, ...options.headers };

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const config = {
    ...options,
    headers,
  };
  const res = await fetch(url, config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const error = new Error(errorData?.message || "Ошибка запроса");
    error.status = res.status;
    error.data = errorData;

    throw error;
  }

  if (res.status === 204) {
    return null;
  }

  return await res.json();
};

export const get = (url) => request(url, { method: "GET" });
export const post = (url, body) => request(url, { method: "POST", body: JSON.stringify(body) });
export const postForm = (url, formData) => request(url, { method: "POST", body: formData });
export const patch = (url, body) => request(url, { method: "PATCH", body: JSON.stringify(body) });
export const del = (url) => request(url, { method: "DELETE" });
