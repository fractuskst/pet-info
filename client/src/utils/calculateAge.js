const calculateAge = (birthTimeStamp) => {
  if (!birthTimeStamp) return { years: 0, months: 0 };

  const now = Date.now();
  const diffMs = now - birthTimeStamp;

  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const diffMonths = diffDays / 30.44; // среднее количество дней в месяце
  const diffYears = diffMonths / 12;

  const years = Math.floor(diffYears);
  const months = Math.floor(diffMonths % 12);

  return { years, months };
};

export default calculateAge;
