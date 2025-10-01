/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoongService } from "@/services/goong/goong.service";
import { App } from "antd";
import { FormInstance } from "antd/es/form";
import { useCallback, useRef, useState } from "react";

interface UseAddressHandlerProps {
  form: FormInstance;
  updateMapUrl: (lat: string, lng: string) => void;
}

export const useAddressHandler = ({ form, updateMapUrl }: UseAddressHandlerProps) => {
  const [addressOptions, setAddressOptions] = useState<any[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { message } = App.useApp();

  // API function for address autocomplete with debouncing
  const handleAddressSearch = useCallback(async (searchText: string) => {
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchText.trim() === "") {
      setAddressOptions([]);
      return;
    }

    // Debounce the API call
    debounceRef.current = setTimeout(async () => {
      setAddressLoading(true);
      try {
        const result = await GoongService.getAutoComplete(searchText);
        const options = result.predictions.map((pre: any) => ({
          value: pre.place_id,
          label: pre.description,
          ...pre,
        }));
        setAddressOptions(options);
      } catch (err) {
        console.error("Error fetching address suggestions", err);
        setAddressOptions([]);
      } finally {
        setAddressLoading(false);
      }
    }, 500); // 500ms debounce
  }, []);

  // Enhanced address selection handler - only triggers when user actually selects an option
  const handleAddressSelectEnhanced = useCallback(
    async (selectedLabel: string, option: any) => {
      // Clear the search options to prevent confusion
      setAddressOptions([]);
      
      try {
        setAddressLoading(true);
        // Get the placeId from the option key (which contains the place_id)
        const placeId = option.key;
        const placeDetail: any = await GoongService.getPlaceDetail(placeId);

        const lat = String(placeDetail?.result?.geometry?.location?.lat || "");
        const lng = String(placeDetail?.result?.geometry?.location?.lng || "");

        // Update form fields with place details
        form.setFieldsValue({
          addressLine: selectedLabel, // Use the selected label as the address
          placeId: placeId, // Store placeId separately for reference
          district: placeDetail?.result?.compound?.district || "",
          city: placeDetail?.result?.compound?.province || "",
          lat: lat,
          long: lng,
        });

        // Update map
        updateMapUrl(lat, lng);
        
        // Show success message
        message.success("Đã cập nhật thông tin địa chỉ và bản đồ");
      } catch (error) {
        console.error("Error fetching place details:", error);
        message.error("Lỗi khi lấy thông tin địa chỉ");
      } finally {
        setAddressLoading(false);
      }
    },
    [form, updateMapUrl]
  );

  // Clear address options when input is cleared
  const handleAddressClear = useCallback(() => {
    setAddressOptions([]);
    form.setFieldsValue({
      addressLine: "",
      placeId: "",
      district: "",
      city: "",
      lat: "",
      long: "",
    });
  }, [form]);

  return {
    addressOptions,
    addressLoading,
    handleAddressSearch,
    handleAddressSelectEnhanced,
    handleAddressClear,
  };
};
