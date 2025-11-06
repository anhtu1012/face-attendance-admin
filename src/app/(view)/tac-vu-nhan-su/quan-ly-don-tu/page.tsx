"use client";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { Col, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { IoFilterCircle } from "react-icons/io5";
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
            <Col
              span={24}
              style={{ position: "absolute", top: "13px", right: "10px" }}
            >
              <div className="icon-wrapper">
                <IoFilterCircle
                  size={30}
                  style={{
                    color: "orange",
                    boxShadow:
                      "0 0 30px rgba(227, 141, 48, 0.8), 0 0 100px rgba(227, 141, 48, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                  title="Bộ lọc"
                />
              </div>
            </Col>
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
