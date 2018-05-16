// Convert format date
const FormatDate = (value) => {
  if (!value && value.length === 0) return '';
  const newVal = new Date(value).toDateString();
  return newVal;
};

export default FormatDate;
