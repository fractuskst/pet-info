import calculateAge from "./calculateAge";
import formatAge from "./formatAge";
import getTimestamp from "./getTimestamp";

const prepareFormData = (formData) => {
  const birthTimeStamp = formData.birthDate ? getTimestamp(formData.birthDate) : null;
  const { years, months } = birthTimeStamp ? calculateAge(birthTimeStamp) : { years: null, months: null };

  return {
    ...formData,
    birthDate: birthTimeStamp,
    age: birthTimeStamp ? formatAge(years, months) : null,
  };
};

export default prepareFormData;
