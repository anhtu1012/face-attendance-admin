/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ICellRendererParams } from "@ag-grid-community/core";
import { Button, Popover, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

const IsExistedCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const data: any = params.data || {};
  const isExisted = Boolean(data?.isExisted);
  const reason = data?.reason || data?.existReason || "Không có lý do";

  const content = (
    <div style={{ maxWidth: 320 }}>
      <Paragraph style={{ marginBottom: 6, whiteSpace: "pre-wrap" }}>
        {String(reason)}
      </Paragraph>
    </div>
  );

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Popover
        content={content}
        title={isExisted ? "Lý do (Nhân viên cũ)" : "Ghi chú"}
        trigger="click"
      >
        <Button
          size="small"
          type={isExisted ? "primary" : "default"}
          icon={<InfoCircleOutlined />}
        >
          {isExisted ? "Nhân viên cũ" : "Mới"}
        </Button>
      </Popover>
    </div>
  );
};

export default IsExistedCellRenderer;
