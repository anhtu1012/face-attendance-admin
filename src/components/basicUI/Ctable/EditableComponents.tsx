/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DatePickerProps } from "antd";
import { DatePicker, Form, GetRef, Input, InputNumber, InputRef } from "antd";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Form instance for editable cells
type FormInstance<T> = GetRef<typeof Form<T>>;
export const EditableContext = createContext<FormInstance<any> | null>(null);

// New editable cell types
export type EditableType =
  | "string"
  | "number"
  | "checkbox"
  | "date"
  | undefined;

// Interface for editable cell props
export interface EditableCellProps<T> {
  title: React.ReactNode;
  editable: boolean;
  typeEdit?: EditableType;
  dataIndex: keyof T;
  record: T;
  handleSave: (record: T) => void;
  children: React.ReactNode;
}

// Editable row component
export const EditableRow = ({
  index,
  ...props
}: { index: number } & React.HTMLAttributes<HTMLTableRowElement>) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

// Editable cell component
export function EditableCell<T extends object>({
  title,
  editable,
  typeEdit = "string",
  dataIndex,
  record,
  handleSave,
  children,
  ...restProps
}: EditableCellProps<T>) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const datePickerRef = useRef<any>(null);
  const form = useContext(EditableContext)!;

  // Check if the record is a parent row (has children)
  const isParentRow =
    record && (record as any).children && (record as any).children.length > 0;

  useEffect(() => {
    if (editing) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      if (datePickerRef.current) {
        datePickerRef.current.focus();
      }
    }
  }, [editing]);

  const toggleEdit = () => {
    // Don't allow editing if it's a parent row
    if (isParentRow) return;

    setEditing(!editing);
    // For checkbox, we need special handling - don't set field value during toggle
    if (typeEdit !== "checkbox") {
      form.setFieldsValue({ [dataIndex as string]: record[dataIndex] });
    }
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  const handleDateChange: DatePickerProps["onChange"] = (date) => {
    if (date) {
      form.setFieldsValue({ [dataIndex as string]: date });
      save();
    }
  };

  let childNode = children;

  if (editable && !isParentRow) {
    if (typeEdit === "checkbox") {
      // For checkbox columns, we need special handling
      console.log(`Rendering checkbox for ${String(dataIndex)}`, record);

      // Just use the existing children which should contain the correct checkbox
      // This will allow the column render function to control the checked state
      childNode = children;
    } else {
      // For non-checkbox types, use the standard editing approach
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex as string}
          // rules={[{ required: true, message: `${title} is required.` }]}
        >
          {typeEdit === "number" ? (
            <InputNumber
              ref={inputRef as any}
              onPressEnter={save}
              onBlur={save}
              style={{ width: "100%" }}
            />
          ) : typeEdit === "date" ? (
            <DatePicker
              ref={datePickerRef}
              onChange={handleDateChange}
              style={{ width: "100%" }}
            />
          ) : (
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          )}
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingInlineEnd: 24,
            height: "100%",
            display: "flex",
            alignItems: "center",
            cursor: isParentRow ? "default" : "pointer",
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  }

  return <td {...restProps}>{childNode}</td>;
}
