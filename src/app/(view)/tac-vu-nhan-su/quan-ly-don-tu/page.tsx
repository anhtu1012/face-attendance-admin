"use client";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { Col, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import Filter from "./_components/Filter/Filter";
import TableApplication from "./_components/TableApplication";
import { FilterRef, TableApplicationRef } from "./_types/prop";
import "./index.scss";

function Page() {
  const filterRef = useRef<FilterRef>(null);
  const tableRef = useRef<TableApplicationRef>(null);
  const [selected] = useState("Bộ lọc");

  useEffect(() => {
    if (selected === "Bộ lọc") {
      tableRef.current?.refetch();
    }
  }, [selected]);

  return (
    <>
      <LayoutContent
        layoutType={5}
        option={{
          floatButton: true,
          sizeAdjust: [3, 7],
          cardTitle: "Bộ lọc - Quản lý đơn từ",
        }}
        content1={
          <Row gutter={5}>
            <Filter
              ref={filterRef}
              onSubmit={() => {
                tableRef.current?.refetch();
              }}
            />
          </Row>
        }
        content2={
          <div
            className="application-content-main"
            style={{ position: "relative" }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <TableApplication ref={tableRef} filterRef={filterRef} />
              </Col>
            </Row>
          </div>
        }
      />
    </>
  );
}

export default Page;
