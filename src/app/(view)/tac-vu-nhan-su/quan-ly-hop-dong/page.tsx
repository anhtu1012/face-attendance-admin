"use client";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { NguoiDungItem } from "@/dtos/quan-tri-he-thong/nguoi-dung/nguoi-dung.dto";
import { Col, Modal, Row, Button } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { IoFilterCircle } from "react-icons/io5";
import { PdfPreview } from "../../../../components/Template/components/PdfPreview";
import { generatePdfFromHtml } from "../../../../components/Template/services/pdfService";
import { ContractData } from "../../../../components/Template/types";
import ContractFormView from "./_components/ContractFormView/ContractFormView";
import Filter from "./_components/Filter/Filter";
import TableContract from "./_components/TableContract";
import UserComponent from "./_components/UserComponent/UserComponent";
import { FilterRef, TableContractRef } from "./_types/prop";
import "./index.scss";
import NotFound from "@/app/(error)/not_found/page";

function Page() {
  const filterRef = useRef<FilterRef>(null);
  const tableRef = useRef<TableContractRef>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState("Bộ lọc");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<NguoiDungItem | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const scales = [0.2, 0.5, 0.75, 1];
  const [scaleIndex, setScaleIndex] = useState<number>(3);

  const contractData: ContractData | null = useMemo(() => {
    if (!selectedUser) return null;
    console.log({ selectedUser });

    return {
      title: "Hợp đồng lao động",
      city: "Hồ Chí Minh",
      effectiveDate: new Date().toISOString(),
      partyA: {
        companyName: "Công ty TNHH ABC",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        representative: "Nguyễn Văn A",
        position: "Giám đốc",
        refNumber: "HD-001",
      },
      partyB: {
        name: `${selectedUser.firstName} ${selectedUser.lastName}`,
        nationality: "Việt Nam",
        dob: selectedUser.birthDay ? selectedUser.birthDay.toISOString() : "",
        address: selectedUser.address || "416/23 Lê Văn Sỹ, Phường 14, Quận 3",
        idNumber: "123456789",
        idIssueDate: "2020-01-01",
        idIssuePlace: "TP.HCM",
      },
    };
  }, [selectedUser]);

  const handleExportPdf = async () => {
    if (pdfRef.current) {
      await generatePdfFromHtml(pdfRef.current, "contract.pdf");
    }
  };

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
          sizeAdjust: selected === "Bộ lọc" ? [3, 7] : [5, 5],
          cardTitle: selected === "Bộ lọc" ? "Bộ lọc - Quản lý hợp đồng" : "",
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
                        zIndex: 1000,
                      }}
                      title="Tạo hợp đồng"
                      onClick={() => {
                        setModalOpen(true);
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
                onSubmit={() => {
                  tableRef.current?.refetch();
                }}
              />
            )}
            {selected === "Tạo hợp đồng" && (
              <Col span={24}>
                <ContractFormView
                  selectedUser={selectedUser}
                  onMarkdownChange={setMarkdown}
                  onExportPdf={handleExportPdf}
                />
              </Col>
            )}
          </Row>
        }
        content2={
          <div
            className="contract-content-main"
            style={{ position: "relative" }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <div
                  style={{
                    transform: `scale(${scales[scaleIndex]})`,
                    transformOrigin: "top left",
                  }}
                >
                  {selected === "Bộ lọc" && (
                    <TableContract ref={tableRef} filterRef={filterRef} />
                  )}
                  {selected === "Tạo hợp đồng" && (
                    <Col span={24}>
                      {contractData ? (
                        <PdfPreview
                          ref={pdfRef}
                          data={contractData}
                          markdown={markdown}
                          signatures={{ partyA: null, partyB: null }}
                        />
                      ) : (
                        <NotFound />
                      )}
                    </Col>
                  )}
                </div>
              </Col>
            </Row>
            {selected === "Tạo hợp đồng" && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <Button
                  style={{ color: "black" }}
                  onClick={() =>
                    setScaleIndex(Math.min(scaleIndex + 1, scales.length - 1))
                  }
                  disabled={scaleIndex === scales.length - 1}
                >
                  +
                </Button>
                <Button
                  style={{ color: "black" }}
                  onClick={() => setScaleIndex(Math.max(scaleIndex - 1, 0))}
                  disabled={scaleIndex === 0}
                >
                  -
                </Button>
              </div>
            )}
          </div>
        }
      />
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={800}
        title="Chọn người dùng"
      >
        <UserComponent
          shouldFetch={modalOpen}
          onUserSelect={(user) => {
            setSelectedUser(user);
            setSelected("Tạo hợp đồng");
            setModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
}

export default Page;
