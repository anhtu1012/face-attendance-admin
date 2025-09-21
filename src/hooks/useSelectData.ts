import { useState, useEffect } from "react";
import { SelectOption } from "@/dtos/select/select.dto";
import SelectServices from "@/services/select/select.service";

type UseSelectDataOptions = {
  fetchRole?: boolean;
  fetchShift?: boolean;
};

export const useSelectData = (options: UseSelectDataOptions = {}) => {
  const defaultOptions = { fetchRole: false, fetchShift: false };
  const mergedOptions = { ...defaultOptions, ...options };
  const [selectRole, setSelectRole] = useState<SelectOption[]>([]);
  const [selectShift, setSelectShift] = useState<SelectOption[]>([]);
  const [selectGender] = useState<SelectOption[]>([
    {
      label: "Male",
      value: "M",
    },
    {
      label: "Female",
      value: "F",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (mergedOptions.fetchRole !== false) {
          const role = await SelectServices.getSelectRole();
          setSelectRole(role.data);
        }
        if (mergedOptions.fetchShift !== false) {
          const shift = await SelectServices.getSelectShift();
          setSelectShift(shift.data || []);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [mergedOptions.fetchRole, mergedOptions.fetchShift]);

  return { selectRole, selectShift, selectGender };
};
