/* eslint-disable @typescript-eslint/no-explicit-any */
export const extractFile = (val: any): File | null => {
  if (!val) return null;
  if (val instanceof File) return val;
  if (Array.isArray(val)) {
    const first = val[0];
    return (first?.originFileObj as File) ?? (first?.file as File) ?? null;
  }
  return (val?.originFileObj as File) ?? (val?.file as File) ?? null;
};
