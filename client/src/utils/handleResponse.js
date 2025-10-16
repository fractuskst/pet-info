async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

export default handleResponse;
