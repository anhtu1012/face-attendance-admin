export const titleCase = (str = "") => {
  return str
    .toLowerCase()
    .split(" ")
    .filter((filterItem) => filterItem)
    .map((mapItem) => mapItem.charAt(0).toUpperCase() + mapItem.substring(1))
    .join(" ");
};

export const handleUrl = (url = "") => {
  return url.toLowerCase();
};

export const uppercase = (str = "") => {
  return str.toUpperCase();
};

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const generateString = (length = 8) => {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const isNumeric = (text: string) =>
  /^[+-]?\d+(?:,?\d+)?(\.\d+)?$/.test(text);
