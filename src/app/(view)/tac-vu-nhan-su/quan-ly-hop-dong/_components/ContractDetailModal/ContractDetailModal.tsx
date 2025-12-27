import { ContractWithUser } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.dto";
import QuanLyHopDongServices from "@/services/tac-vu-nhan-su/quan-ly-hop-dong/quan-ly-hop-dong.service";
import Cbutton from "@/components/basicUI/Cbutton";
import { App, Modal, Space, Spin, Tabs, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import {
  FaFileContract,
  FaPlus,
  FaStop,
  FaUser,
  FaListAlt,
} from "react-icons/fa";
import "./ContractDetailModal.scss";
import ContractInfo from "./ContractInfo";
import UserInfo from "./UserInfo";
import AppendixList from "./AppendixList";
import AppendixDetailModal from "./AppendixDetailModal";
import { getStatusColor, getStatusText } from "./utils";
import { AppendixDetail } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/appendix/appendix.dto";

const { TabPane } = Tabs;

interface ContractDetailModalProps {
  open: boolean;
  onClose: () => void;
  contractId: string | null;
  onAddAppendix?: (contractData: ContractWithUser) => void;
  onTerminateContract?: (contractData: ContractWithUser) => void;
  onUploadSuccess?: () => void;
}

const ContractDetailModal: React.FC<ContractDetailModalProps> = ({
  open,
  onClose,
  contractId,
  onAddAppendix,
  onTerminateContract,
  onUploadSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ContractWithUser | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedAppendixId, setSelectedAppendixId] = useState<string | null>(
    null
  );
  const [appendixModalOpen, setAppendixModalOpen] = useState(false);
  const [appendixList, setAppendixList] = useState<AppendixDetail[]>([]); // Replace 'any' with the actual type
const { modal } = App.useApp();
  const fetchContractDetail = useCallback(async () => {
    if (!contractId) return;

    setLoading(true);
    try {
      const response = await QuanLyHopDongServices.getChiTietHopDong(
        contractId
      );
      const responsePhuLuc = await QuanLyHopDongServices.getPhuLucHopDong(
        [],
        undefined,
        { userContractId: contractId }
      );
      setAppendixList(responsePhuLuc.data);
      setData(response);
    } catch (error) {
      console.error("Error fetching contract detail:", error);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    if (open && contractId) {
      fetchContractDetail();
    }
  }, [open, contractId, fetchContractDetail]);

  const handleUploadPdf = async (file?: File | null) => {
    // Build and log FormData when a file is provided.
    setUploadLoading(true);
    try {
      if (!file) {
        console.warn("handleUploadPdf called without a file");
      } else {
        const formData = new FormData();
        // append the file under a common field name 'file' or 'contractFile'
        formData.append("fileContract", file, file.name);
        // append any additional metadata if available
        if (contractId) formData.append("userContractId", contractId);
        console.groupEnd();
        await QuanLyHopDongServices.uploadContractMultipart(formData);
      }

      message.success("Upload PDF thành công!");
      // refresh data after upload
      await fetchContractDetail();
      // notify parent to refresh table if provided
      if (typeof onUploadSuccess === "function") {
        try {
          onUploadSuccess();
        } catch (e) {
          console.warn("onUploadSuccess callback threw:", e);
        }
      }
    } catch (error) {
      message.error("Upload PDF thất bại!");
      console.error("Error uploading PDF:", error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleAddAppendix = () => {
    if (data && onAddAppendix) {
      onAddAppendix(data);
      onClose();
    }
  };

  const handleTerminateContract = () => {
    if (data && onTerminateContract) {
      modal.confirm({
        title: "Xác nhận ngưng hợp đồng",
        content: "Bạn có chắc chắn muốn ngưng hợp đồng này không?",
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: () => {
          onTerminateContract(data);
          onClose();
        },
      });
    }
  };

  const handleViewAppendixDetail = (appendixId: string) => {
    setSelectedAppendixId(appendixId);
    setAppendixModalOpen(true);
  };

  const closeAppendixModal = () => {
    setAppendixModalOpen(false);
    setSelectedAppendixId(null);
  };

  return (
    <Modal
      title={
        <div className="modal-header">
          <FaFileContract className="modal-header-icon" />
          <span>Chi tiết hợp đồng</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={
        <Space size="middle">
          <Cbutton
            origin={{
              bgcolor: "transparent",
              color: "rgb(13, 71, 161)",
              hoverBgColor:
                "linear-gradient(45deg, rgba(13, 71, 161, 0.15), rgba(30, 136, 229, 0.15), rgba(13, 71, 161, 0.15))",
              border: "2px solid rgb(13, 71, 161)",
              hoverColor: "rgb(13, 71, 161)",
            }}
            icon={<FaPlus />}
            onClick={handleAddAppendix}
            size="large"
            style={{
              fontWeight: 600,
              boxShadow: "0 3px 10px rgba(13, 71, 161, 0.15)",
            }}
          >
            Thêm phụ lục
          </Cbutton>
          <Cbutton
            icon={<FaStop />}
            onClick={handleTerminateContract}
            origin={{
              bgcolor: "#ff4d4f",
              color: "white",
              hoverBgColor: "#ff7875",
              border: "2px solid #ff4d4f",
            }}
            size="large"
            style={{
              fontWeight: 600,
              boxShadow: "0 3px 10px rgba(255, 77, 79, 0.2)",
            }}
          >
            Ngưng hợp đồng
          </Cbutton>
        </Space>
      }
      width={1200}
      className="contract-detail-modal"
    >
      <Spin spinning={loading || uploadLoading}>
        {data && (
          <Tabs defaultActiveKey="1" className="contract-tabs">
            <TabPane
              tab={
                <span>
                  <FaFileContract /> Thông tin hợp đồng
                </span>
              }
              key="1"
            >
              <ContractInfo
                contract={data.contract}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
                uploadLoading={uploadLoading}
                onUploadPdf={handleUploadPdf}
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <FaUser /> Thông tin nhân viên
                </span>
              }
              key="2"
            >
              <UserInfo userInfor={data.userInfor} contract={data.contract} />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <FaListAlt /> Phụ lục hợp đồng ({appendixList.length})
                </span>
              }
              key="3"
            >
              <AppendixList
                appendices={appendixList}
                onViewDetail={handleViewAppendixDetail}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
            </TabPane>
          </Tabs>
        )}
      </Spin>

      <AppendixDetailModal
        open={appendixModalOpen}
        onClose={closeAppendixModal}
        appendix={
          selectedAppendixId
            ? appendixList.find((a) => a.id === selectedAppendixId) || null
            : null
        }
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
      />
    </Modal>
  );
};

export default ContractDetailModal;
