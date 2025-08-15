const formatAge = (years, months) => {
  if (months) {
    return `${years}.${months}`;
  }
  return `${years}`;
};

export default formatAge;
