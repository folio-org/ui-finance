// Convert format date
const FormatDate = (value) => {
  console.log(value);
  if(!value && value.length ===0) return '';
  const newVal = new Date(value).toDateString();
  return newVal;
}

export default FormatDate;
