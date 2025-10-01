/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from "react";
import { Select, Spin } from "antd";
import { ICellEditorParams } from "@ag-grid-community/core";
import type { SelectProps } from "antd";
import useDebounce from "@/hooks/useDebounce";
import { useBroadcastChannel } from "@/hooks/useBroadcastChannel";

interface AntdSelectCellEditorProps extends ICellEditorParams {
  values?: { label: string; value: string }[] | string[];
  onValueChange?: (newValue: string, oldValue: string) => any;
  onScroll?: (itemIndex: number) => void;
  allowAddOption?: boolean;
  openOutside?: boolean; // Controls if dropdown opens automatically (default: false)
  isLoading?: boolean; // Added isLoading prop to control loading state
  // API integration props
  onSearchAPI?: (
    searchText: string
  ) => Promise<Array<{ value: any; label: string }>>;
  apiDebounceTime?: number; // Debounce time for API calls
  minSearchLength?: number; // Minimum characters to trigger API call
  loadingInitialOptions?: boolean; // Whether to show loading when mounting
  onSelect?: (selectedOption: any) => void; // Callback when an option is selected
}
interface BoardCastChannelNew {
  quickSearch: string; // Define the type of your bookingAssignItems here
}

const AntdSelectCellEditor = forwardRef(
  (props: AntdSelectCellEditorProps, ref) => {
    // Make sure to handle the case where props.value might be undefined
    const [value, setValue] = useState<string | undefined>(props.value);
    const [options, setOptions] = useState<SelectProps["options"]>([]);
    const [originalOptions, setOriginalOptions] = useState<
      SelectProps["options"]
    >([]);
    // Use external loading state if provided
    const [loading, setLoading] = useState<boolean>(props.isLoading || false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");
    const debouncedSearchInput = useDebounce(
      searchInput,
      props.apiDebounceTime || 500
    );
    const selectRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const boardCastChannelAssign =
      useBroadcastChannel<BoardCastChannelNew>("quickSearch");

    // Memoize normalizeOptions to prevent recreation on each render
    const normalizeOptions = useCallback(
      (
        values: { label: string; value: string }[] | string[] | undefined
      ): { label: string; value: string; key: string }[] => {
        if (!values || !Array.isArray(values)) return [];

        // Map to add a unique key
        return values.map((item, index) => {
          if (typeof item === "string") {
            return {
              label: item,
              value: item,
              // Add a unique key based on value and index
              key: `${item}_${index}`,
            };
          }
          // Make sure we always return an object with label, value and key properties
          if (item && typeof item === "object" && "value" in item) {
            return {
              label: item.label || String(item.value),
              value: String(item.value),
              key: `${item.value}_${index}`,
            };
          }
          // Fallback for unexpected item types
          return {
            label: String(item),
            value: String(item),
            // Add a unique key for fallback case
            key: `option_${index}`,
          };
        });
      },
      []
    );

    const handleSendMessageBoardCastNew = useCallback(
      (quickSearch: BoardCastChannelNew) => {
        boardCastChannelAssign.sendMessage(quickSearch);
      },
      [boardCastChannelAssign]
    );

    // Initialize options
    useEffect(() => {
      const normalizedOptions = normalizeOptions(props.values);
      setOptions(normalizedOptions);
      setOriginalOptions(normalizedOptions);
    }, [props.values, normalizeOptions]);

    // Update loading state when props.isLoading changes
    useEffect(() => {
      if (props.isLoading !== undefined) {
        setLoading(props.isLoading);
      }
    }, [props.isLoading]);

    // Handle API search integration
    useEffect(() => {
      const handleAPISearch = async () => {
        // Skip API call if no onSearchAPI function is provided
        if (!props.onSearchAPI) return;

        // Skip if search input is less than minimum length
        const minLength = props.minSearchLength || 1;
        if (searchInput.length < minLength) {
          // Reset to original options if search is too short
          if (searchInput.length === 0) {
            setOptions(normalizeOptions(props.values));
            setLoading(false);
          }
          return;
        }

        try {
          setLoading(true);
          const apiResults = await props.onSearchAPI(searchInput);
          const normalizedResults = normalizeOptions(apiResults);
          setOptions(normalizedResults);
        } catch (error) {
          console.error("API search error:", error);
          // Fallback to original options on error
          setOptions(normalizeOptions(props.values));
        } finally {
          setLoading(false);
        }
      };

      handleAPISearch();
    }, [
      debouncedSearchInput,
      props.onSearchAPI,
      props.minSearchLength,
      props.values,
      normalizeOptions,
    ]);

    // Initialize with API call if loadingInitialOptions is true
    useEffect(() => {
      const initializeWithAPI = async () => {
        if (props.loadingInitialOptions && props.onSearchAPI) {
          try {
            setLoading(true);
            const initialResults = await props.onSearchAPI("");
            const normalizedResults = normalizeOptions(initialResults);
            setOptions(normalizedResults);
            setOriginalOptions(normalizedResults);
          } catch (error) {
            console.error("Initial API load error:", error);
            // Fallback to provided values
            const normalizedOptions = normalizeOptions(props.values);
            setOptions(normalizedOptions);
            setOriginalOptions(normalizedOptions);
          } finally {
            setLoading(false);
          }
        }
      };

      initializeWithAPI();
    }, [
      props.loadingInitialOptions,
      props.onSearchAPI,
      props.values,
      normalizeOptions,
    ]);

    // Handle change event
    const handleChange = (newValue: string) => {
      setValue(newValue);

      // Find the selected option
      const selectedOption = (options ?? []).find(
        (option) => option.value === newValue
      );
      if (props.onSelect && selectedOption) {
        props.onSelect(selectedOption);
      }

      if (props.onValueChange) {
        const validatedValue = props.onValueChange(newValue, props.value);
        if (validatedValue !== undefined) {
          setValue(validatedValue);
        }
      }

      // This helps with AG-Grid auto-completion on selection
      setTimeout(() => {
        props.stopEditing();
      }, 0);
    };

    // Handle search filtering
    const handleSearch = (input: string) => {
      setSearchInput(input);

      // If API integration is available, let the useEffect handle the API call
      if (props.onSearchAPI) {
        setLoading(true);
        return;
      }

      // Original local filtering logic (when no API integration)
      setLoading(true);

      // If onScroll is not provided, we can filter locally
      if (!props.onScroll && originalOptions) {
        const filteredOptions = originalOptions.filter(
          (option) =>
            option?.label
              ?.toString()
              .toLowerCase()
              .includes(input.toLowerCase()) ||
            option?.value
              ?.toString()
              .toLowerCase()
              .includes(input.toLowerCase())
        );

        // Check if we need to add the input as a new option
        if (props.allowAddOption && input.trim() !== "") {
          // Check if the exact input already exists in original options
          const inputExists = originalOptions.some(
            (option) =>
              option?.value?.toString().toLowerCase() === input.toLowerCase() ||
              option?.label?.toString().toLowerCase() === input.toLowerCase()
          );

          // If input doesn't exist, add it as a new option
          if (!inputExists) {
            // Add a unique key for the new option
            filteredOptions.unshift({
              label: input,
              value: input,
              key: `new_${input}`,
            });
          }
        }

        setOptions(filteredOptions);
        setLoading(false);
      }

      // Still broadcast the search term
      handleSendMessageBoardCastNew({ quickSearch: input });
    };

    // Process the search when debouncedSearchInput changes (legacy support for onScroll)
    useEffect(() => {
      // Skip this effect if API integration is available
      if (props.onSearchAPI) return;

      // Only process when debouncedSearchInput changes
      // Skip this effect if no onScroll is provided
      if (!props.onScroll) return;

      const processSearch = () => {
        if (!searchInput) {
          setOptions(normalizeOptions(props.values));
          setLoading(false);
          handleSendMessageBoardCastNew({ quickSearch: "" });
          return;
        }

        // Simulate async search with timeout
        setTimeout(() => {
          setOptions(normalizeOptions(props.values));
          setLoading(false);
        }, 300);
      };

      processSearch();
    }, [
      debouncedSearchInput,
      props.values,
      props.onScroll,
      props.onSearchAPI,
      handleSendMessageBoardCastNew,
      normalizeOptions,
    ]);

    // Handle dropdown scroll
    const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
      if (!props.onScroll) return;

      const target = e.target as HTMLElement;
      const scrollTop = target.scrollTop;
      const itemHeight = 32; // Default height of antd select items

      // Calculate approximate item index
      const currentItemIndex = Math.floor(scrollTop / itemHeight);
      props.onScroll(currentItemIndex);
    };

    // Handle dropdown toggle
    const handleDropdownVisibleChange = (open: boolean) => {
      setIsOpen(open);
    };

    // Calculate dropdown position to avoid being cut off
    const calculatePosition = () => {
      if (!containerRef.current) return {};

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Check if there's more space above than below
      const verticalPlacement =
        spaceBelow < 200 && spaceAbove > spaceBelow ? "top" : "bottom";

      return {
        verticalPlacement,
      };
    };

    // AgGrid required interface
    useImperativeHandle(ref, () => {
      return {
        getValue() {
          return value;
        },
        isCancelBeforeStart() {
          return false;
        },
        isCancelAfterEnd() {
          return false;
        },
        // This ensures proper focus behavior in AG-Grid
        afterGuiAttached() {
          if (selectRef.current) {
            selectRef.current.focus();
            // Only open dropdown immediately if openOutside is explicitly true
            if (props.openOutside === true) {
              setTimeout(() => {
                setIsOpen(true);
              }, 10);
            }
          }
        },
      };
    });

    // Focus the select when the editor is mounted
    useEffect(() => {
      window.setTimeout(() => {
        // selectRef.current?.focus();
        // Only open dropdown if openOutside is explicitly true
        setIsOpen(props.openOutside === true);
      }, 10);
    }, [props.openOutside]);

    // Position dropdown based on available space
    const dropdownProps = calculatePosition();

    return (
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
        <Select
          ref={selectRef}
          showSearch
          value={value}
          placeholder="Select a value"
          defaultActiveFirstOption={false}
          filterOption={false}
          onSearch={handleSearch}
          onChange={handleChange}
          notFoundContent={loading ? <Spin size="small" /> : "Không có dữ liệu"}
          style={{ width: "100%", height: "125%", borderRadius: "14px" }}
          options={options || []}
          onPopupScroll={handlePopupScroll}
          virtual
          listHeight={256}
          popupMatchSelectWidth={false}
          styles={{ popup: { root: { minWidth: "200px" } } }}
          dropdownAlign={{
            points:
              dropdownProps.verticalPlacement === "top"
                ? ["tl", "bl"] // If top, align dropdown's top-left with input's bottom-left
                : ["bl", "tl"], // If bottom, align dropdown's bottom-left with input's top-left
            offset: [0, dropdownProps.verticalPlacement === "top" ? -4 : 4],
            overflow: { adjustX: true, adjustY: true },
          }}
          getPopupContainer={() => document.body}
          open={isOpen}
          onDropdownVisibleChange={handleDropdownVisibleChange}
          loading={loading} // Pass loading state to Select component
        />
      </div>
    );
  }
);

AntdSelectCellEditor.displayName = "AntdSelectCellEditor";

export default AntdSelectCellEditor;
