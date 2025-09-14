/* eslint-disable @typescript-eslint/no-explicit-any */
export const CustomTooltip = (props: any) => {
  if (!props.value) return null;

  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: "#ffeeee",
        color: "#d32f2f",
        border: "1px solid #d32f2f",
        maxWidth: "400px",
        whiteSpace: "pre-line", // This preserves line breaks
        fontWeight: "bold",
        fontSize: "14px",
        lineHeight: "2.0", // Increased line height for better spacing
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {props.value}
    </div>
  );
};
