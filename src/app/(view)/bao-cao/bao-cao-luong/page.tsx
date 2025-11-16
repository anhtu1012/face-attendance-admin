"use client";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { Col, Row } from "antd";
import { useRef } from "react";
import Filter from "./_components/Filter/Filter";
import SalaryTable from "./_components/SalaryTable/SalaryTable";
import { FilterRef, TableSalaryRef } from "./_types/prop";
import "./page.scss";

function Page() {
  const filterRef = useRef<FilterRef>(null);
  const tableRef = useRef<TableSalaryRef>(null);
  const handleFilterSubmit = () => {
    tableRef.current?.refetch();
  };

  return (
    <LayoutContent
      layoutType={5}
      option={{
        floatButton: true,
        sizeAdjust: [3, 7],
        cardTitle: "Bộ lọc - Báo cáo lương",
      }}
      content1={
        <Row gutter={5}>
          <Filter ref={filterRef} onSubmit={handleFilterSubmit} />
        </Row>
      }
      content2={
        <Row gutter={16}>
          <Col span={24}>
            <SalaryTable ref={tableRef} filterRef={filterRef} />
          </Col>
        </Row>
      }
    />
  );
}

export default Page;
