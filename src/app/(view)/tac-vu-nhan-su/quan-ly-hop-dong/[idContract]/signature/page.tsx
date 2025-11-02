/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import SignaturePad from "signature_pad";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Import components
import { PdfPreview } from "@/components/Template/components/PdfPreview";
import LoadingSpinner from "./_components/LoadingSpinner";
import OTPModal from "./_components/OTPModal";
import SignatureToolbox from "./_components/SignatureToolbox";
import { PrintIcon } from "./_components/icons";

// Import types
import { ContractData, Signatures } from "@/components/Template/types";
import { ContractDetail } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.dto";

// Import service
import QuanLyHopDongServices from "@/services/tac-vu-nhan-su/quan-ly-hop-dong/quan-ly-hop-dong.service";

// Import styles
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import { useSelector } from "react-redux";
import "./signature.scss";
import { createFileFromDataUrl } from "./_utils/createFileFromDataUrl";

const ContractSignaturePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const idContract = params.idContract as string;
  const { userProfile } = useSelector(selectAuthLogin);
  const messageApi = useAntdMessage();
  // Data states
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [contractDetail, setContractDetail] = useState<ContractDetail | null>(
    null
  );
  // const [userInfo, setUserInfo] = useState<UserInfor | null>(null);
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

  // PDF file state
  const [pdfFile, setPdfFile] = useState<File | null>(null);

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
        // setUserInfo(user);
        setContractContent(contract.content || "");

        // Load existing signatures if any
        if (contract.directorSignature) {
          setSignatures((prev) => ({
            ...prev,
            partyA: contract.directorSignature || null,
          }));
        }

        if (contract.userSignature) {
          setSignatures((prev) => ({
            ...prev,
            partyB: contract.userSignature || null,
          }));
        }

        // Transform data for PdfPreview component
        const transformedData: ContractData = {
          userContractId: contract.id,
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
    onAfterPrint: async () => {
      console.log("Document printed successfully");
      // Generate PDF file after printing
      await generatePdfFile();
    },
  });

  // Generate PDF file from the printable content and return it
  const generatePdfFileAndReturn = async (): Promise<File | null> => {
    try {
      if (!printableRef.current) {
        console.error("Printable ref is not available");
        return null;
      }

      // Capture the HTML element as canvas
      const canvas = await html2canvas(printableRef.current, {
        useCORS: true,
        logging: false,
        width: printableRef.current.scrollWidth,
        height: printableRef.current.scrollHeight,
      });

      // Calculate PDF dimensions (A4 size)
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;

      // Add first page
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;

      // Add additional pages if content exceeds one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      // Convert PDF to Blob then to File
      const pdfBlob = pdf.output("blob");
      const fileName = `HopDong-${
        contractDetail?.contractNumber || idContract
      }-signed-${Date.now()}.pdf`;
      const file = new File([pdfBlob], fileName, {
        type: "application/pdf",
      });

      // Save to state
      setPdfFile(file);
      console.log("PDF file created:", fileName);
      return file;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    }
  };

  // Generate PDF file from the printable content (for print button)
  const generatePdfFile = async () => {
    try {
      messageApi.info("Đang tạo file PDF...");
      const file = await generatePdfFileAndReturn();
      if (file) {
        messageApi.success("Tạo file PDF thành công!");
      } else {
        messageApi.error("Không thể tạo file PDF. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      messageApi.error("Không thể tạo file PDF. Vui lòng thử lại.");
    }
  };

  // --- OTP HANDLERS ---
  const handleVerifySignature = async () => {
    if (!signatures.partyA || !signatures.partyB) {
      alert("Vui lòng hoàn thành cả 2 chữ ký trước khi xác thực.");
      return;
    }
    console.log("contractId", contractData?.userContractId);
    await QuanLyHopDongServices.getOpt({
      userContractId: contractData?.userContractId || "",
      gmail: userProfile.email || "",
    });
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
      // Step 1: Save signatures
      const formData = new FormData();
      formData.append("userContractId", contractData?.userContractId || "");
      formData.append("otpCode", otpValue);

      const fileSignA = await createFileFromDataUrl(
        signatures.partyA,
        `signatureA-${Date.now()}.png`
      );

      if (fileSignA) {
        formData.append("fileSignUrl", fileSignA);
      } else {
        // As a fallback, append an empty string so backend receives the field
        formData.append("fileSignUrl", "");
      }

      formData.append("signatureType", "DIRECTOR");
      await QuanLyHopDongServices.saveContractSignatures(formData);
      messageApi.success("Xác thực OTP và lưu chữ ký thành công.");

      // Step 2: Generate and upload PDF file
      try {
        messageApi.info("Đang tạo và upload file PDF...");

        // Generate PDF if not already created
        let pdfFileToUpload = pdfFile;
        if (!pdfFileToUpload) {
          pdfFileToUpload = await generatePdfFileAndReturn();
        }

        if (pdfFileToUpload) {
          const uploadFormData = new FormData();
          uploadFormData.append(
            "fileContract",
            pdfFileToUpload,
            pdfFileToUpload.name
          );
          uploadFormData.append(
            "userContractId",
            contractData?.userContractId || ""
          );

          await QuanLyHopDongServices.uploadContractMultipart(uploadFormData);
          messageApi.success("Upload file PDF thành công!");
        } else {
          messageApi.warning("Không thể tạo file PDF. Vui lòng thử lại.");
        }
      } catch (uploadErr) {
        console.error("PDF generation/upload error:", uploadErr);
        messageApi.warning(
          "Lưu chữ ký thành công nhưng không thể upload PDF. Vui lòng upload thủ công sau."
        );
      }

      setShowOTPModal(false);
      setOtpValue("");
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
      await QuanLyHopDongServices.getOpt({
        userContractId: contractData?.userContractId || "",
        gmail: userProfile.email || "",
      });
      messageApi.success("Đã gửi lại mã OTP thành công.");
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
