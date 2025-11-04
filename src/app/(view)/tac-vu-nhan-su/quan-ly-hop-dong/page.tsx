"use client";
import NotFound from "@/app/(error)/not_found/page";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { UserCreateContractItem } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/user-create-contract/user-create-contract.dto";
import { ContractWithUser } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.dto";
import { Button, Col, Modal, Row } from "antd";
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
import { useSelector } from "react-redux";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";

function Page() {
  const filterRef = useRef<FilterRef>(null);
  const tableRef = useRef<TableContractRef>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState("Bộ lọc");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] =
    useState<UserCreateContractItem | null>(null);
  const [contractDetailData, setContractDetailData] =
    useState<ContractWithUser | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [contractTitle, setContractTitle] =
    useState<string>("Hợp đồng lao động");
  const [formMode, setFormMode] = useState<"create" | "appendix">("create");
  const scales = [0.2, 0.5, 0.75, 1];
  const [scaleIndex, setScaleIndex] = useState<number>(3);
  const { companyInformation } = useSelector(selectAuthLogin);
  const contractData: ContractData | null = useMemo(() => {
    // Nếu có dữ liệu từ contract detail, sử dụng nó
    if (contractDetailData) {
      return {
        title: contractDetailData.contract.contractTypeName,
        city: companyInformation.city || "TP. Hồ Chí Minh",
        effectiveDate: contractDetailData.contract.startDate,
        partyA: {
          companyName: companyInformation.companyName || "",
          address: companyInformation.addressLine || "",
          representative: "Nguyễn Văn A",
          position: "Giám đốc",
          refNumber: contractDetailData.contract.contractNumber,
        },
        partyB: {
          name: contractDetailData.userInfor.fullName || "",
          nationality: contractDetailData.userInfor.nationality || "Việt Nam",
          dob: contractDetailData.userInfor.birthday || "",
          address: contractDetailData.userInfor.currentAddress || "",
          idNumber: contractDetailData.userInfor.citizenIdentityCard || "",
          idIssueDate:
            contractDetailData.userInfor.issueDate || new Date().toISOString(),
          idIssuePlace:
            contractDetailData.userInfor.issueAt || "Công an TP.HCM",
        },
      };
    }

    // Nếu có selected user, sử dụng nó
    if (!selectedUser) return null;
    console.log({ selectedUser });

    return {
      title: contractTitle,
      city: companyInformation.city || "TP. Hồ Chí Minh",
      effectiveDate: new Date().toISOString(),
      partyA: {
        companyName: companyInformation.companyName || "",
        address: companyInformation.addressLine || "",
        representative: "Nguyễn Văn A",
        position: "Giám đốc",
        refNumber: "HD-001",
      },
      partyB: {
        name: selectedUser.fullName || "",
        nationality: selectedUser.nationality || "Việt Nam",
        dob: selectedUser.birthDay,
        address: selectedUser.currentAddress || "",
        idNumber: selectedUser.citizenIdentityCard || "",
        idIssueDate: selectedUser.issueDate || new Date().toISOString(),
        idIssuePlace: selectedUser.issueAt || "Công an TP.HCM",
      },
    };
  }, [
    companyInformation.addressLine,
    companyInformation.city,
    companyInformation.companyName,
    selectedUser,
    contractTitle,
    contractDetailData,
  ]);

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

  const handleAddAppendix = (contractData: ContractWithUser) => {
    setContractDetailData(contractData);
    setFormMode("appendix");
    setSelected("Tạo hợp đồng");
  };

  const handleTerminateContract = (contractData: ContractWithUser) => {
    // TODO: Implement terminate contract logic
    console.log("Terminate contract:", contractData);
  };

  return (
    <>
      <LayoutContent
        layoutType={5}
        option={{
          floatButton: true,
          sizeAdjust: selected === "Bộ lọc" ? [3, 7] : [4, 6],
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
                        setFormMode("create");
                        setContractDetailData(null);
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
                  contractDetailData={contractDetailData}
                  onMarkdownChange={setMarkdown}
                  onExportPdf={handleExportPdf}
                  onContractTypeChange={setContractTitle}
                  mode={formMode}
                  pdfRef={pdfRef}
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
                    <TableContract
                      ref={tableRef}
                      filterRef={filterRef}
                      onAddAppendix={handleAddAppendix}
                      onTerminateContract={handleTerminateContract}
                    />
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
        width={1200}
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
