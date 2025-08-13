const getTimestamp = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.getTime();
};

export default getTimestamp;
