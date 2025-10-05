/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import DanhMucCompanyInfoServices from "@/services/danh-muc/thong-tin-cong-ty/thong-tin-cong-ty.service";
import { ErrorResponse } from "@/types/error";
import { Button, Form } from "antd";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import CompanyInfoForm from "./_components/CompanyInfoForm";
import ShiftManagementCard from "./_components/ShiftManagementCard";
import SmallGoogleMap from "./_components/SmallGoogleMap";
import { useAddressHandler } from "./_hooks/useAddressHandler";
import { useMapHandler } from "./_hooks/useMapHandler";
import "./index.scss";
import { CompanyInfo } from "@/dtos/danhMuc/thong-tin-cong-ty/thongTinCongTy.dto";
import { LegalRepresentativeDto } from "@/types/dtoRepresent";

function Page() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const messageApi = useAntdMessage();
  const [represent, setRepresent] = useState<LegalRepresentativeDto[]>([]);

  // Map handling
  const { mapUrl, currentLat, currentLong, updateMapUrl, clearMap } =
    useMapHandler();

  // Address handling
  const {
    addressOptions,
    addressLoading,
    handleAddressSearch,
    handleAddressSelectEnhanced,
    handleAddressClear,
  } = useAddressHandler({ form, updateMapUrl });

  // Handle form submission
  const handleSubmit = async (values: any) => {
    console.log("handleSubmit called with values:", values);
    setLoading(true);

    try {
      // Format shifts with proper time format
      const formattedShifts =
        values.shift?.map((shift: any) => ({
          shiftName: shift.shiftName,
          startTime: shift.startTime
            ? dayjs(shift.startTime).format("HH:mm")
            : "",
          endTime: shift.endTime ? dayjs(shift.endTime).format("HH:mm") : "",
        })) || [];

      const companyData: CompanyInfo = {
        ...values,
        establishDate: values.establishDate
          ? dayjs(values.establishDate).toISOString()
          : "",
        shiftInfor: JSON.stringify(formattedShifts),
      };
      // Build multipart/form-data
      const formData = new FormData();
      const logoUploadFile = values.logoUrl as any;
      const logoOriginFile: File | undefined = logoUploadFile?.originFileObj;
      if (logoOriginFile) {
        formData.append("logoFile", logoOriginFile, logoOriginFile.name);
      }

      // Append each field as string
      Object.entries(companyData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      await DanhMucCompanyInfoServices.createDanhMucCompanyInfoMultipart(
        formData
      );
  messageApi.success("Lưu thông tin công ty thành công!");
    } catch (error) {
  console.error("Error saving company info:", error);
  messageApi.error("Lỗi khi lưu thông tin công ty");
    } finally {
      setLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
  form.resetFields();
  clearMap();
  messageApi.info("Đã đặt lại form");
  };

  // Load fake data for testing
  const fetchDataCompany = useCallback(async () => {
    try {
      const res = await DanhMucCompanyInfoServices.getDanhMucCompanyInfo();
      const resRepresent =
        await DanhMucCompanyInfoServices.getRepresentCompanyInfo();
      setRepresent(resRepresent.data || []);
      const companyInfo = res.data[0];
      const rawShifts = Array.isArray(companyInfo.shifts)
        ? companyInfo.shifts
        : [];
      const formattedShifts = rawShifts.map((shift) => ({
        shiftName: shift.shiftName,
        startTime: dayjs(shift.startTime, "HH:mm"),
        endTime: dayjs(shift.endTime, "HH:mm"),
      }));
      // Set form values
      form.setFieldsValue({
        ...companyInfo,
        establishDate: companyInfo.establishDate
          ? dayjs(companyInfo.establishDate)
          : null,
        identityIssuedDate: companyInfo.identityIssuedDate
          ? dayjs(companyInfo.identityIssuedDate)
          : null,
        shift: formattedShifts,
      });
      // Update map with coordinates
      updateMapUrl(companyInfo.lat, companyInfo.long);
    } catch (error: any) {
      const errorData = error.response?.data as ErrorResponse;
      console.log(errorData);
    }
  }, [form, updateMapUrl]);

  useEffect(() => {
    fetchDataCompany();
  }, [fetchDataCompany]);
  return (
    <LayoutContent
      layoutType={1}
      content1={
        <div className="company-info-container">
          <div className="content-wrapper">
            <CompanyInfoForm
              form={form}
              handleSubmit={handleSubmit}
              addressOptions={addressOptions}
              addressLoading={addressLoading}
              handleAddressSearch={handleAddressSearch}
              handleAddressSelectEnhanced={handleAddressSelectEnhanced}
              handleAddressClear={handleAddressClear}
              mapComponent={
                <SmallGoogleMap
                  mapUrl={mapUrl}
                  currentLat={currentLat}
                  currentLong={currentLong}
                />
              }
              legalRepresentativeOptions={represent}
            >
              <ShiftManagementCard form={form} />
            </CompanyInfoForm>

            <div className="form-actions">
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={loading}
                size="large"
              >
                Lưu thông tin
              </Button>
              <Button onClick={handleReset} size="large">
                Đặt lại
              </Button>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default Page;
