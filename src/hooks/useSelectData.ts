import { useState, useEffect, useRef } from "react";
import { SelectOption } from "@/dtos/select/select.dto";
import SelectServices from "@/services/select/select.service";

type UseSelectDataOptions = {
  fetchRole?: boolean;
  fetchShift?: boolean;
  fetchSkill?: boolean;
  fetchDepartment?: boolean;
  fetchContractType?: boolean;
  fetchAllowance?: boolean;
};

export const useSelectData = (options: UseSelectDataOptions = {}) => {
  const defaultOptions = {
    fetchRole: false,
    fetchShift: false,
    fetchSkill: false,
    fetchDepartment: false,
    fetchContractType: false,
    fetchAllowance: false,
  };
  const mergedOptions = { ...defaultOptions, ...options };
  const didFetchRef = useRef(false);
  const [selectRole, setSelectRole] = useState<SelectOption[]>([]);
  const [selectShift, setSelectShift] = useState<SelectOption[]>([]);
  const [selectSkill, setSelectSkill] = useState<SelectOption[]>([]);
  const [selectDepartment, setSelectDepartment] = useState<SelectOption[]>([]);
  const [selectContractType, setSelectContractType] = useState<SelectOption[]>(
    []
  );
  const [selectAllowance, setSelectAllowance] = useState<SelectOption[]>([]);

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
  const [selectStatusContract] = useState<SelectOption[]>([
    {
      label: "Chờ tải hợp đồng",
      value: "PENDING",
    },
    {
      label: "Chờ nhân viên ký",
      value: "USER_SIGNED",
    },
    {
      label: "Chờ ký",
      value: "DIRECTOR_SIGNED",
    },
    {
      label: "Không hoạt động",
      value: "INACTIVE",
    },
    {
      label: "Hết hạn",
      value: "EXPIRED",
    },
    {
      label: "Hoạt động",
      value: "ACTIVE",
    },
    {
      label: "Hoạt động +",
      value: "ACTIVE_EXTENDED",
    },
  ]);
  const [selectCandidate] = useState<SelectOption[]>([
    { label: "Liên hệ", value: "TO_CONTACT" }, //1
    { label: "Không LH Được", value: "CANNOT_CONTACT" }, //1
    { label: "Phỏng vấn", value: "TO_INTERVIEW" }, //2
    { label: "Rớt PV", value: "INTERVIEW_FAILED" }, //2
    { label: "Đã hẹn PV", value: "INTERVIEW_SCHEDULED" }, //2
    { label: "Đã hẹn PV1", value: "INTERVIEW_SCHEDULED_R1" }, //2
    { label: "Đã hẹn PV2", value: "INTERVIEW_SCHEDULED_R2" }, //2
    { label: "Đã hẹn PV3", value: "INTERVIEW_SCHEDULED_R3" }, //2
    { label: "Đã hẹn PV4", value: "INTERVIEW_SCHEDULED_R4" }, //2
    { label: "Đã hẹn PV5", value: "INTERVIEW_SCHEDULED_R5" }, //2
    { label: "Đã đậu PV Vòng 1", value: "TO_INTERVIEW_R1" }, //2
    { label: "Đã đậu PV Vòng 2", value: "TO_INTERVIEW_R2" }, //2
    { label: "Đã đậu PV Vòng 3", value: "TO_INTERVIEW_R3" }, //2
    { label: "Đã đậu PV Vòng 4", value: "TO_INTERVIEW_R4" }, //2
    { label: "Đã đậu PV Vòng 5", value: "TO_INTERVIEW_R5" }, //2
    { label: "Hẹn lại", value: "INTERVIEW_RESCHEDULED" }, //2
    { label: "Nhận việc", value: "JOB_OFFERED" }, //3
    { label: "Đã hẹn NV", value: "JOB_SCHEDULED" }, //3
    { label: "Làm Hợp đồng", value: "CONTRACT_SIGNING" }, //4
    { label: "Từ chối PV", value: "INTERVIEW_REJECTED" }, //5
    { label: "Không đến PV", value: "NOT_COMING_INTERVIEW" }, //5
    { label: "Không đến NV", value: "NOT_COMING_OFFER" }, //5
    { label: "Từ chối NV", value: "OFFER_REJECTED" }, //5
    { label: "HT Từ chối", value: "REJECTED" }, //5
    { label: "Chưa phù hợp", value: "NOT_SUITABLE" }, //6
    { label: "Hoàn thành", value: "HOAN_THANH" }, //7
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

  const [selectStatusForm] = useState<SelectOption[]>([
    { label: "Đang xử lý", value: "PENDING" },
    { label: "Đã duyệt", value: "ACCEPTED" },
    { label: "Từ chối", value: "REJECTED" },
    // { label: "Hủy", value: "CANCELLED" },
    { label: "Hủy", value: "INACTIVE" },
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
        if (mergedOptions.fetchDepartment !== false) {
          const department = await SelectServices.getSelectDepartment();
          setSelectDepartment(department.data || []);
        }
        if (mergedOptions.fetchContractType !== false) {
          const contractType = await SelectServices.getSelectContractType();
          setSelectContractType(contractType.data || []);
        }
        if (mergedOptions.fetchAllowance !== false) {
          const allowance = await SelectServices.getSelectAllowance();
          setSelectAllowance(allowance.data || []);
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
    selectDepartment,
    selectExperienceYears,
    selectContractType,
    selectAllowance,
    selectStatusContract,
    selectStatusForm,
  };
};
