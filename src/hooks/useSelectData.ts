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
  const [selectCandidate] = useState<SelectOption[]>([
    { label: "Liên hệ", value: "Applied" }, //1
    { label: "Không LH Được", value: "Applied" }, //1
    { label: "Phỏng vấn", value: "Interview" }, //2
    { label: "Rớt PV", value: "Failed" }, //2
    { label: "Hẹn lại", value: "Reschedule" }, //2
    { label: "Nhận việc", value: "Offer" }, //3
    { label: "Làm Hợp đồng", value: "Hired" }, //4
    { label: "Từ chối PV", value: "RejectedPV" }, //5
    { label: "Từ chối NV", value: "RejectedNV" }, //5
    { label: "Chưa phù hợp", value: "NotSuitable" }, //6
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

  return { selectRole, selectShift, selectGender, selectCandidate };
};
