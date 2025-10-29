/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import SignaturePad from "signature_pad";

// Import components
import { PdfPreview } from "@/components/Template/components/PdfPreview";
import LoadingSpinner from "./_components/LoadingSpinner";
import OTPModal from "./_components/OTPModal";
import SignatureToolbox from "./_components/SignatureToolbox";
import { PrintIcon } from "./_components/icons";

// Import types
import { ContractData, Signatures } from "@/components/Template/types";
import {
  ContractDetail,
  UserInfor,
} from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.dto";

// Import service
import QuanLyHopDongServices from "@/services/tac-vu-nhan-su/quan-ly-hop-dong/quan-ly-hop-dong.service";

// Import styles
import "./signature.scss";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";

const ContractSignaturePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const idContract = params.idContract as string;

  // Data states
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [contractDetail, setContractDetail] = useState<ContractDetail | null>(
    null
  );
  const [userInfo, setUserInfo] = useState<UserInfor | null>(null);
  const [contractContent, setContractContent] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [signatures, setSignatures] = useState<Signatures>({
    partyA: null,
    partyB: null,
  });

  // Signature Pad States for PartyA
  const [penColorA, setPenColorA] = useState("black");
  const signaturePadARef = useRef<any>(null);
  const signatureCanvasARef = useRef<HTMLCanvasElement>(null);

  // OTP Modal State
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Print ref
  const printableRef = useRef<HTMLDivElement>(null);
  console.log("user", userInfo);

  // --- FETCH CONTRACT DATA ---
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        setIsLoading(true);
        const response = await QuanLyHopDongServices.getChiTietHopDong(
          idContract
        );

        const contract = response.contract;
        const user = response.userInfor;

        setContractDetail(contract);
        setUserInfo(user);
        setContractContent(contract.content || "");

        // Load existing signatures if any
        if (contract.directorSignature) {
          setSignatures((prev) => ({
            ...prev,
            partyA: contract.directorSignature || null,
          }));
        }
        if (true) {
          setSignatures((prev) => ({
            ...prev,
            partyB:
              "https://thegioibut.com/wp-content/uploads/2020/09/chu-ky-dep-chu-ky-mau-dep-1024x484.jpg",
          }));
        }

        // Transform data for PdfPreview component
        const transformedData: ContractData = {
          title: contract.contractTypeName || "HỢP ĐỒNG LAO ĐỘNG",
          city: "Hà Nội", // Could be dynamic based on company info
          effectiveDate: contract.startDate,
          partyA: {
            companyName: "CÔNG TY CỔ PHẦN 9HK", // Should come from company settings
            address:
              "Tầng 12A, Tòa nhà Center Building, Hapulico Complex, số 01 Nguyễn Huy Tưởng, phường Thanh Xuân Trung, quận Thanh Xuân, Hà Nội", // Should come from company settings
            representative: "Nguyễn Văn A", // Should come from director info
            position: "Giám đốc",
            refNumber: contract.contractNumber || "001/2024/HĐLĐ",
          },
          partyB: {
            name: user.fullName || "",
            nationality: user.nationality || "Việt Nam",
            dob: user.birthday || "",
            address: user.currentAddress || user.permanentAddress || "",
            idNumber: user.citizenIdentityCard || "",
            idIssueDate: user.issueDate || "",
            idIssuePlace: user.issueAt || "",
          },
        };

        setContractData(transformedData);
      } catch (error) {
        console.error("Error fetching contract data:", error);
        alert("Không thể tải thông tin hợp đồng. Vui lòng thử lại.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (idContract) {
      fetchContractData();
    }
  }, [idContract, router]);

  // --- INITIALIZE SIGNATURE PADS ---
  useEffect(() => {
    const initSignaturePad = (
      canvasRef: React.RefObject<HTMLCanvasElement | null>,
      padRef: React.MutableRefObject<any>,
      penColor: string
    ) => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);

        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(ratio, ratio);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        padRef.current = new SignaturePad(canvas, {
          backgroundColor: "rgb(241, 245, 249)",
          penColor: penColor,
          minWidth: 0.5,
          maxWidth: 2.5,
          throttle: 16,
          minDistance: 5,
          velocityFilterWeight: 0.7,
        });

        padRef.current.clear();
      }
    };

    if (!isLoading && contractData) {
      // Initialize PartyA pad if no signature yet
      if (!signatures.partyA) {
        initSignaturePad(signatureCanvasARef, signaturePadARef, penColorA);
      }
    }
  }, [
    isLoading,
    contractData,
    penColorA,
    signatures.partyA,
    signatures.partyB,
  ]);

  // Update pen colors
  useEffect(() => {
    if (signaturePadARef.current) {
      signaturePadARef.current.penColor = penColorA;
    }
  }, [penColorA]);

  // --- SIGNATURE HANDLERS ---
  const handleConfirmSignatureA = () => {
    if (signaturePadARef.current && !signaturePadARef.current.isEmpty()) {
      const dataUrl = signaturePadARef.current.toDataURL("image/png");
      setSignatures((prev) => ({ ...prev, partyA: dataUrl }));
    } else {
      alert("Vui lòng ký trước khi xác nhận.");
    }
  };

  // --- PRINT FUNCTIONALITY ---
  const handlePrint = useReactToPrint({
    contentRef: printableRef,
    documentTitle: `HopDong-${
      contractDetail?.contractNumber || idContract
    }-signed`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact;
          margin: 0;
          padding: 0;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
    onAfterPrint: () => {
      console.log("Document printed successfully");
    },
  });

  // --- OTP HANDLERS ---
  const handleVerifySignature = () => {
    if (!signatures.partyA || !signatures.partyB) {
      alert("Vui lòng hoàn thành cả 2 chữ ký trước khi xác thực.");
      return;
    }

    setShowOTPModal(true);
    setTimeout(() => {
      const firstInput = document.querySelector(
        'input[data-index="0"]'
      ) as HTMLInputElement;
      firstInput?.focus();
    }, 100);
  };

  const handleOTPSubmit = async () => {
    if (otpValue.length !== 6) {
      alert("Vui lòng nhập đầy đủ 6 chữ số OTP");
      return;
    }

    setIsVerifying(true);

    try {
      // Call API to save signatures with OTP verification
      await QuanLyHopDongServices.saveContractSignatures(idContract, {
        directorSignature: signatures.partyA || undefined,
        userSignature: signatures.partyB || undefined,
        otpCode: otpValue,
      });

      alert("Xác thực thành công! Chữ ký đã được lưu.");
      setShowOTPModal(false);
      setOtpValue("");

      // Redirect back to contract list or detail page
      setTimeout(() => {
        router.push("/tac-vu-nhan-su/quan-ly-hop-dong");
      }, 1000);
    } catch (err: any) {
      console.error("OTP verification error:", err);
      const errorMessage =
        err?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      alert(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCloseOTPModal = () => {
    setShowOTPModal(false);
    setOtpValue("");
  };

  const handleResendOTP = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Mã OTP đã được gửi lại!");
    } catch (err) {
      console.error("Resend OTP error:", err);
      alert("Không thể gửi lại OTP. Vui lòng thử lại.");
    }
  };

  // --- RENDER ---
  if (isLoading || !contractData) {
    return <LoadingSpinner />;
  }

  const bothSignaturesCompleted = signatures.partyA && signatures.partyB;

  return (
    <div className="contract-signature-container">
      {/* <div className="header">
        <h1>Ký hợp đồng điện tử</h1>
        <p>
          Hợp đồng số: {contractDetail?.contractNumber || "N/A"} -{" "}
          {contractDetail?.contractTypeName || ""}
        </p>
      </div> */}
      <LayoutContent
        layoutType={5}
        option={{
          floatButton: true,
          sizeAdjust: [6, 4],
        }}
        content1={
          <>
            {/* <div className="pdf-preview-section"> */}
            <div ref={printableRef}>
              <PdfPreview
                data={contractData}
                markdown={contractContent}
                signatures={signatures}
              />
            </div>
            {/* </div> */}
          </>
        }
        content2={
          <>
            {" "}
            <div className="signature-section">
              {/* Party A Signature */}
              <SignatureToolbox
                signatureType="partyA"
                canvasRef={signatureCanvasARef}
                signaturePadRef={signaturePadARef}
                penColor={penColorA}
                setPenColor={setPenColorA}
                handleConfirmSignature={handleConfirmSignatureA}
                hasSignature={!!signatures.partyA}
                signatureDataUrl={signatures.partyA}
              />

              {/* Finalize Section */}
              {bothSignaturesCompleted && (
                <div className="finalize-section">
                  <h2>Hoàn tất & Lưu</h2>
                  <p>
                    Cả 2 chữ ký đã hoàn thành. Bạn có thể in hoặc xác thực để
                    lưu hợp đồng.
                  </p>

                  <div className="action-buttons">
                    <button onClick={handlePrint} className="print-button">
                      <PrintIcon className="print-icon" />
                      In hợp đồng (A4)
                    </button>
                    <button
                      onClick={handleVerifySignature}
                      className="verify-button"
                    >
                      Xác thực và lưu chữ ký
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        }
      />

      <div className="content-grid">
        {/* PDF Preview Section */}

        {/* Signature Section */}
      </div>

      {/* OTP Modal */}
      <OTPModal
        showOTPModal={showOTPModal}
        otpValue={otpValue}
        setOtpValue={setOtpValue}
        isVerifying={isVerifying}
        handleOTPSubmit={handleOTPSubmit}
        handleCloseOTPModal={handleCloseOTPModal}
        handleResendOTP={handleResendOTP}
      />
    </div>
  );
};

export default ContractSignaturePage;
