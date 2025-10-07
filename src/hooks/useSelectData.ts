import { useState, useEffect, useRef } from "react";
import { SelectOption } from "@/dtos/select/select.dto";
import SelectServices from "@/services/select/select.service";

type UseSelectDataOptions = {
  fetchRole?: boolean;
  fetchShift?: boolean;
  fetchSkill?: boolean;
};

export const useSelectData = (options: UseSelectDataOptions = {}) => {
  const defaultOptions = {
    fetchRole: false,
    fetchShift: false,
    fetchSkill: false,
  };
  const mergedOptions = { ...defaultOptions, ...options };
  const didFetchRef = useRef(false);
  const [selectRole, setSelectRole] = useState<SelectOption[]>([]);
  const [selectShift, setSelectShift] = useState<SelectOption[]>([]);
  const [selectSkill, setSelectSkill] = useState<SelectOption[]>([]);

  const [selectGender] = useState<SelectOption[]>([
    {
      label: "Nam",
      value: "M",
    },
    {
      label: "Nữ",
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
  const [selectExperience] = useState<SelectOption[]>([
    { value: "0", label: "Không cần kinh nghiệm" },
    { value: "0-1", label: "Từ 0 đến 1 năm " },
    { value: "1-3", label: "Từ 1 đến 3 năm" },
    { value: "3-5", label: "Từ 3 đến 5 năm" },
    { value: "5-7", label: "Từ 5 đến 7 năm" },
    { value: "10", label: "Trên 10 năm" },
  ]);

  const [selectExperienceYears] = useState<SelectOption[]>([
    { value: "0", label: "Chưa có kinh nghiệm" },
    { value: "0.5", label: "6 tháng" },
    { value: "1", label: "1 năm" },
    { value: "1.5", label: "1 năm rưỡi" },
    { value: "2", label: "2 năm" },
    { value: "2.5", label: "2 năm rưỡi" },
    { value: "3", label: "3 năm" },
    { value: "3.5", label: "3 năm rưỡi" },
    { value: "4", label: "4 năm" },
    { value: "4.5", label: "4 năm rưỡi" },
    { value: "5", label: "5 năm" },
    { value: "5.5", label: "5 năm rưỡi" },
    { value: "6", label: "6 năm" },
    { value: "6.5", label: "6 năm rưỡi" },
    { value: "7", label: "7 năm" },
    { value: "7.5", label: "7 năm rưỡi" },
    { value: "8", label: "8 năm" },
    { value: "8.5", label: "8 năm rưỡi" },
    { value: "9", label: "9 năm" },
    { value: "9.5", label: "9 năm rưỡi" },
    { value: "10", label: "10+ năm" },
  ]);

  // Run only once on mount (guarded) — prevent duplicate calls in Strict Mode
  useEffect(() => {
    // guard to avoid double-fetch in Strict Mode / development
    if (didFetchRef.current) return;
    didFetchRef.current = true;

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
        if (mergedOptions.fetchSkill !== false) {
          const skill = await SelectServices.getSelectSkill();
          setSelectSkill(skill.data || []);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    selectRole,
    selectShift,
    selectGender,
    selectCandidate,
    selectSkill,
    selectExperience,
    selectExperienceYears,
  };
};
