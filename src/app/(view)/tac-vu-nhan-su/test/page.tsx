"use client";

import React, { useState, useCallback, useRef } from "react";
import { PartyAInfo } from "../../../../components/Template/components/PartyAInfo";
import { PartyBForm } from "../../../../components/Template/components/PartyBForm";
import { MarkdownEditor } from "../../../../components/Template/components/MarkdownEditor";
import { PdfPreview } from "../../../../components/Template/components/PdfPreview";
import { SignaturePad } from "../../../../components/Template/components/SignaturePad";
import { PdfViewer } from "../../../../components/Template/components/PdfViewer";
import { AiModal } from "../../../../components/Template/components/AiModal";
import {
  SignatureIcon,
  DownloadIcon,
  ArrowLeftIcon,
  CloseIcon,
  PenIcon,
  UploadIcon,
} from "../../../../components/Template/components/IconComponents";
import Image from "next/image";
import {
  ContractData,
  PartyA,
  PartyB,
  Signatures,
} from "../../../../components/Template/types";
import {
  addSignaturesToPdf,
  generatePdfFromHtml,
} from "../../../../components/Template/services/pdfService";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";

const partyAData: PartyA = {
  companyName: "CÔNG TY TNHH DỊCH VỤ TIN HỌC CEH",
  address: "64/1K Võ Oanh, Phường 25, Bình Thạnh, TPHCM",
  representative: "ĐỒNG VĂN ĐỨC",
  position: "Giám đốc",
  refNumber: `NV000309/${new Date().getFullYear()}/HDHV`,
};

const initialContractData: ContractData = {
  title: "HỢP ĐỒNG HỌC VIỆC",
  city: "Tp Hồ Chí Minh",
  effectiveDate: new Date().toISOString().split("T")[0],
  partyA: partyAData,
  partyB: {
    name: "Phạm Anh Tú",
    nationality: "Việt Nam",
    dob: "2003-12-10",
    address: "33/2 Thanh An, Thanh Hải, Thạnh Phú, Bến Tre",
    idNumber: "083203004629",
    idIssueDate: "2021-08-20",
    idIssuePlace: "CCSQLHCTTXH",
  },
};

const initialMarkdown = `
# ĐIỀU 1. ĐỐI TƯỢNG CỦA HỢP ĐỒNG
Bên A tuyển dụng học viên là Bên B vào vị trí học việc lập trình với nội dung chi tiết quy định tại Điều 2 và Điều 3 của Hợp đồng này.

# ĐIỀU 2. THỜI GIAN HỌC VIỆC
Bên A tạo điều kiện cho Bên B học việc theo Hợp đồng trong thời hạn 03 tháng, kể từ ngày 16 tháng 09 năm 2025 đến ngày 15 tháng 12 năm 2025

# ĐIỀU 3. CHẾ ĐỘ HỌC VIỆC
- Thời gian học: 32 giờ/tuần (4 ngày/tuần)
- Ca học:
  + Sáng từ: 8 giờ 30 phút đến 12 giờ
  + Chiều từ: 13 giờ 30 phút đến 18 giờ
  
# ĐIỀU 4. CHI PHÍ TRỢ CẤP, PHƯƠNG THỨC THANH TOÁN
Chi phí trợ cấp: Bên B được trả trợ cấp trong quá trình học việc là: 8.000.000 đồng/tháng.
`;

const SignatureTrigger = ({
  partyName,
  signature,
  onSign,
  onClear,
}: {
  partyName: string;
  signature: string | null;
  onSign: () => void;
  onClear: () => void;
}) => (
  <div className="signature-trigger">
    <h3 className="signature-title">{partyName}</h3>
    {signature ? (
      <div className="signature-display">
        <Image
          src={signature}
          alt={`${partyName} signature`}
          width={300}
          height={100}
          className="w-full h-auto"
        />
        <button
          onClick={onClear}
          className="clear-btn"
          aria-label="Clear Signature"
        >
          <CloseIcon />
        </button>
      </div>
    ) : (
      <div className="signature-placeholder">
        <p className="placeholder-text">Signature Required</p>
        <button onClick={onSign} className="btn btn-primary">
          <PenIcon />
          Sign Here
        </button>
      </div>
    )}
  </div>
);

const SignatureModal = ({
  partyName,
  onSave,
  onClose,
}: {
  partyName: string;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}) => (
  <div className="modal-overlay" role="dialog" aria-modal="true">
    <div className="modal-content">
      <h2 className="modal-title">Provide Signature for {partyName}</h2>
      <button
        onClick={onClose}
        className="close-btn"
        aria-label="Close signature pad"
      >
        <CloseIcon />
      </button>
      <SignaturePad onSave={onSave} />
    </div>
  </div>
);

export default function App() {
  const [step, setStep] = useState<"edit" | "sign">("edit");
  const [contractData, setContractData] =
    useState<ContractData>(initialContractData);
  const [markdownContent, setMarkdownContent] =
    useState<string>(initialMarkdown);
  const [signatures, setSignatures] = useState<Signatures>({
    partyA: null,
    partyB: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [signingParty, setSigningParty] = useState<keyof Signatures | null>(
    null
  );
  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>("");

  const pdfPreviewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePartyBChange = useCallback((changedValues: Partial<PartyB>) => {
    const update = { ...changedValues };
    if (update.dob && typeof update.dob !== "string") {
      // @ts-expect-error - dayjs object with format method
      update.dob = update.dob.format("YYYY-MM-DD");
    }
    if (update.idIssueDate && typeof update.idIssueDate !== "string") {
      // @ts-expect-error - dayjs object with format method
      update.idIssueDate = update.idIssueDate.format("YYYY-MM-DD");
    }
    setContractData((prev: ContractData) => ({
      ...prev,
      partyB: { ...prev.partyB, ...update },
    }));
  }, []);

  const handleContractInfoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setContractData((prev: ContractData) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdownContent(value);
  }, []);

  const handleSaveSignature = useCallback(
    (party: keyof Signatures, dataUrl: string) => {
      console.log(
        `Saving signature for ${party}:`,
        dataUrl.substring(0, 50) + "..."
      );
      setSignatures((prev: Signatures) => ({ ...prev, [party]: dataUrl }));
      setSigningParty(null);
    },
    []
  );

  const handleClearSignature = useCallback((party: keyof Signatures) => {
    setSignatures((prev: Signatures) => ({ ...prev, [party]: null }));
  }, []);

  const handleDownload = useCallback(async () => {
    setIsLoading(true);
    try {
      if (uploadedPdf) {
        await addSignaturesToPdf(
          uploadedPdf,
          signatures.partyA,
          signatures.partyB
        );
      } else if (pdfPreviewRef.current) {
        await generatePdfFromHtml(pdfPreviewRef.current, contractData.title);
      }
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [uploadedPdf, signatures, contractData.title]);

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedPdf(file);
      setContractData((prev: ContractData) => ({ ...prev, title: file.name }));
      setStep("sign");
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setStep("edit");
    setContractData(initialContractData);
    setMarkdownContent(initialMarkdown);
    setSignatures({ partyA: null, partyB: null });
    setUploadedPdf(null);
  };

  const handleOpenSignatureModal = (party: keyof Signatures) => {
    setSigningParty(party);
  };

  const handleCloseSignatureModal = () => {
    setSigningParty(null);
  };

  const handleGenerateContract = async () => {
    if (!aiPrompt.trim()) return;

    setIsAiLoading(true);
    try {
      // Note: Google GenAI would need to be installed and configured
      // For now, we'll just use a placeholder response
      const mockResponse = `
# ĐIỀU 1. ĐỐI TƯỢNG CỦA HỢP ĐỒNG
${aiPrompt}

# ĐIỀU 2. THỜI GIAN HỌP VIỆC
Thời gian thực hiện theo yêu cầu được nêu.

# ĐIỀU 3. CHẾ ĐỘ LÀM VIỆC
Áp dụng các điều khoản phù hợp với yêu cầu.
      `;

      setMarkdownContent(mockResponse);
      setIsAiModalOpen(false);
      setAiPrompt("");
    } catch (error) {
      console.error("AI generation failed:", error);
      alert(
        "An error occurred while generating the contract terms. Please check the console and try again."
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderSignatureBlock = (
    partyName: string,
    signatureData: string | null
  ) => (
    <div className="signature-block">
      {signatureData && (
        <Image
          src={signatureData}
          alt={`${partyName} signature`}
          width={200}
          height={64}
          className="h-16 w-auto mb-2 inline-block"
        />
      )}
      <p className="text-sm text-slate-800 font-semibold">{partyName}</p>
    </div>
  );

  const renderContent = () => {
    if (step === "edit" && !uploadedPdf) {
      return (
        <div className="grid-2">
          <div className="contract-details">
            <h2 className="section-title">Contract Details</h2>
            <div className="form-group">
              <label htmlFor="title">Contract Title</label>
              <input
                id="title"
                name="title"
                value={contractData.title}
                onChange={handleContractInfoChange}
              />
            </div>
            <PartyAInfo data={contractData.partyA} />
            <PartyBForm
              data={contractData.partyB}
              onChange={handlePartyBChange}
            />
            <MarkdownEditor
              value={markdownContent}
              onChange={handleMarkdownChange}
              onGenerateWithAi={() => setIsAiModalOpen(true)}
            />
          </div>
          <div className="preview-panel">
            <h2 className="preview-header">Live Preview</h2>
            <div className="preview-content">
              <PdfPreview
                ref={pdfPreviewRef}
                data={contractData}
                markdown={markdownContent}
                signatures={signatures}
              />
            </div>
          </div>
        </div>
      );
    }

    if (step === "sign") {
      const documentTitle = uploadedPdf
        ? uploadedPdf.name
        : "Final Document for Signing";
      const documentView = uploadedPdf ? (
        <div className="preview-content pdf-viewer">
          <PdfViewer file={uploadedPdf} />
          <div className="signature-section">
            {renderSignatureBlock(
              contractData.partyA.representative,
              signatures.partyA
            )}
            {renderSignatureBlock(contractData.partyB.name, signatures.partyB)}
          </div>
        </div>
      ) : (
        <div className="preview-content">
          <PdfPreview
            ref={pdfPreviewRef}
            data={contractData}
            markdown={markdownContent}
            signatures={signatures}
          />
        </div>
      );

      return (
        <div className="grid-2-1">
          <div className="preview-panel document-full">
            <h2 className="preview-header">{documentTitle}</h2>
            {documentView}
          </div>
          <div className="signature-grid">
            <SignatureTrigger
              partyName={`Party A: ${contractData.partyA.representative}`}
              signature={signatures.partyA}
              onSign={() => handleOpenSignatureModal("partyA")}
              onClear={() => handleClearSignature("partyA")}
            />
            <SignatureTrigger
              partyName={`Party B: ${contractData.partyB.name}`}
              signature={signatures.partyB}
              onSign={() => handleOpenSignatureModal("partyB")}
              onClear={() => handleClearSignature("partyB")}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <LayoutContent
      layoutType={1}
      content1={
        <div className="contract-studio">
          <div className="container">
            <header className="header">
              <h1 className="title">Contract Studio</h1>
              <div className="actions">
                {step === "sign" && (
                  <button onClick={handleReset} className="btn btn-slate">
                    <ArrowLeftIcon />
                    {uploadedPdf ? "Start Over" : "Back to Edit"}
                  </button>
                )}
                {step === "edit" && !uploadedPdf && (
                  <button
                    onClick={triggerFileUpload}
                    className="btn btn-secondary"
                  >
                    <UploadIcon /> Upload PDF
                  </button>
                )}
                {step === "edit" ? (
                  <button
                    onClick={() => setStep("sign")}
                    className="btn btn-primary"
                  >
                    Proceed to Sign <SignatureIcon />
                  </button>
                ) : (
                  <button
                    onClick={handleDownload}
                    disabled={
                      isLoading || !signatures.partyA || !signatures.partyB
                    }
                    className="btn btn-success"
                  >
                    {isLoading ? "Generating..." : "Download PDF"}{" "}
                    <DownloadIcon />
                  </button>
                )}
              </div>
            </header>
            <main>{renderContent()}</main>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePdfUpload}
              className="hidden"
              accept="application/pdf"
            />
            {signingParty && (
              <SignatureModal
                partyName={
                  signingParty === "partyA"
                    ? contractData.partyA.representative
                    : contractData.partyB.name
                }
                onSave={(dataUrl) => handleSaveSignature(signingParty, dataUrl)}
                onClose={handleCloseSignatureModal}
              />
            )}
            <AiModal
              isOpen={isAiModalOpen}
              onClose={() => setIsAiModalOpen(false)}
              onGenerate={handleGenerateContract}
              prompt={aiPrompt}
              setPrompt={setAiPrompt}
              isLoading={isAiLoading}
            />
          </div>
        </div>
      }
    />
  );
}
