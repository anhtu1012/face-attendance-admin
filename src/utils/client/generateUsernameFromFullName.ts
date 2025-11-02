import dayjs from "dayjs";

export const generateUsernameFromFullName = (fullName?: string) => {
  if (!fullName) return "";
  // New username rule (Vietnamese-friendly):
  // givenName + initialsOfOtherNames + '+' + 6-digit datetime code (HHmmss)
  // Example: "Lê Đức Minh" -> "minhld+153045"
  let name = fullName.trim().toLowerCase();
  // remove diacritics
  name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // split into parts
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "user";
  const givenName = parts[parts.length - 1]; // last token as given name
  const other = parts.slice(0, parts.length - 1);
  const initials = other.map((p) => p[0] || "").join("");
  const base = (givenName + initials).replace(/[^a-z0-9]/g, "");
  const code = dayjs().format("HHmmss"); // 6-digit time code
  return `${base || "user"}${code}`;
};
