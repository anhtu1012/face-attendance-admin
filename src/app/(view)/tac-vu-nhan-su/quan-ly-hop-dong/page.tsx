"use client";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { useSelectData } from "@/hooks/useSelectData";
import { Col, Row } from "antd";
import { useRef, useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { IoFilterCircle } from "react-icons/io5";
import dynamic from "next/dynamic";
import { FilterRef, TableContractRef } from "./_types/prop";
import "./index.scss";
import Loading from "../../../../components/Loading/Loading";
import Filter from "./_components/Filter/Filter";
import ContractFormView from "./_components/ContractFormView/ContractFormView";
import TableContract from "./_components/TableContract";

// const ContractFormView = dynamic(
//   () => import("./_components/ContractFormView/ContractFormView"),
//   {
//     ssr: false,
//     loading: () => <Loading />,
//   }
// );
const UserWithByRole = dynamic(
  () => import("./_components/UserWithByRole/UserWithByRole"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
function Page() {
  const filterRef = useRef<FilterRef>(null);
  const tableRef = useRef<TableContractRef>(null);
  const [selected, setSelected] = useState("Bộ lọc");
  const { selectRole } = useSelectData({ fetchRole: true });

  useEffect(() => {
    if (selected === "Bộ lọc") {
      tableRef.current?.refetch();
    }
  }, [selected]);
  return (
    <LayoutContent
      layoutType={5}
      option={{
        floatButton: true,
        sizeAdjust: [3, 7],
        cardTitle:
          selected === "Bộ lọc" ? "Bộ lọc - Quản lý hợp đồng" : "Tạo hợp đồng",
      }}
      content1={
        <Row gutter={5}>
          <Col
            span={24}
            style={{ position: "absolute", top: "13px", right: "10px" }}
          >
            {selected === "Bộ lọc" ? (
              <>
                <div className="icon-wrapper">
                  <FaPlusCircle
                    size={30}
                    style={{
                      color: "orange",
                      boxShadow:
                        "0 0 30px rgba(227, 141, 48, 0.8), 0 0 100px rgba(227, 141, 48, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    }}
                    title="Tạo hợp đồng"
                    onClick={() => {
                      setSelected("Tạo hợp đồng");
                    }}
                  />
                </div>
              </>
            ) : (
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
                  onClick={() => {
                    setSelected("Bộ lọc");
                  }}
                />
              </div>
            )}
          </Col>
          {selected === "Bộ lọc" && (
            <Filter
              ref={filterRef}
              onSubmit={() => tableRef.current?.refetch()}
            />
          )}
          {selected === "Tạo hợp đồng" && (
            <Col span={24}>
              <UserWithByRole roleCode={selectRole} />
            </Col>
          )}
        </Row>
      }
      content2={
        <div className="contract-content-main">
          <Row gutter={16}>
            {selected === "Bộ lọc" && (
              <Col span={24}>
                <TableContract ref={tableRef} filterRef={filterRef} />
              </Col>
            )}
            {selected === "Tạo hợp đồng" && (
              <Col span={24}>
                <ContractFormView />
              </Col>
            )}
          </Row>
        </div>
      }
    />
  );
}

export default Page;
