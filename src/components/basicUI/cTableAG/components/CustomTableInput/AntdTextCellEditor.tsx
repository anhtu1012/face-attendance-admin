/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Input } from "antd";
import type { ICellEditorParams } from "@ag-grid-community/core";

interface AntdTextCellEditorProps extends ICellEditorParams {
  maxLength?: number;
  inputType?: "text" | "email";
}

const AntdTextCellEditor = forwardRef((props: AntdTextCellEditorProps, ref) => {
  const initial = props.value ?? "";
  const [value, setValue] = useState<string>(String(initial));
  const inputRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    getValue() {
      return value;
    },
    isCancelBeforeStart() {
      return false;
    },
    isCancelAfterEnd() {
      return false;
    },
    afterGuiAttached() {
      setTimeout(() => inputRef.current?.focus?.(), 10);
    },
  }));

  useEffect(() => {
    setValue(String(props.value ?? ""));
  }, [props.value]);

  const handleBlur = () => {
    // stop editing after blur
    try {
      props.stopEditing();
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      props.stopEditing();
    } else if (e.key === "Escape") {
      props.stopEditing();
    }
  };

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      maxLength={props.maxLength}
      type={props.inputType || "text"}
      placeholder=""
      style={{ width: "100%", height: "100%" }}
    />
  );
});

AntdTextCellEditor.displayName = "AntdTextCellEditor";

export default AntdTextCellEditor;
