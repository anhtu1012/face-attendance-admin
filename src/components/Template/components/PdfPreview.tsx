"use client";

import React, { forwardRef, useMemo } from "react";
import { ContractData, Signatures } from "../types";
import "../styles/PdfPreview.scss";
import dayjs from "dayjs";

interface PdfPreviewProps {
  data: ContractData;
  markdown: string; // Giờ đây sẽ nhận HTML thay vì markdown
  signatures: Signatures;
}

const InfoRow: React.FC<{
  label: string;
  value: string;
  boldValue?: boolean;
}> = ({ label, value, boldValue = false }) => (
  <div className="pdf-info-row">
    <p className="pdf-info-label">{label}</p>
    <p className="pdf-info-separator">:</p>
    <p className={`pdf-info-value ${boldValue ? "pdf-bold-value" : ""}`}>
      {value}
    </p>
  </div>
);

export const PdfPreview = forwardRef<HTMLDivElement, PdfPreviewProps>(
  ({ data, markdown, signatures }, ref) => {
    const formattedDate = useMemo(() => {
      const date = new Date(data.effectiveDate ?? Date.now());
      const adjustedDate = new Date(
        date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)
      );
      return {
        day: adjustedDate.getDate().toString().padStart(2, "0"),
        month: (adjustedDate.getMonth() + 1).toString().padStart(2, "0"),
        year: adjustedDate.getFullYear(),
      };
    }, [data.effectiveDate]);

    return (
      <div ref={ref} className="pdf-preview">
        {/* Header */}
        <div className="pdf-header">
          <div className="pdf-company-info">
            <p className="pdf-company-name">{data.partyA.companyName}</p>
            <div className="pdf-divider"></div>
            <p className="pdf-ref-number">Số: {data.partyA.refNumber}</p>
          </div>
          <div className="pdf-republic-info">
            <p className="pdf-republic-title">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </p>
            <p className="pdf-republic-title">Độc lập – Tự do – Hạnh phúc</p>
            <div className="pdf-divider" style={{ width: "10rem" }}></div>
          </div>
        </div>

        {/* Title */}
        <p className="pdf-date">
          {data.city}, ngày {formattedDate.day} tháng {formattedDate.month} năm{" "}
          {formattedDate.year}
        </p>
        <h1 className="pdf-title">{data.title}</h1>

        {/* Preamble */}
        <div className="pdf-preamble">
          <p>
            <em>
              - Căn cứ Bộ luật Dân sự của nước Cộng hòa Xã hội Chủ nghĩa Việt
              Nam số 91/2015/QH15 ngày 24/11/2015 và các văn bản hướng dẫn thi
              hành;
            </em>
          </p>
          <p>
            <em>
              - Căn cứ Luật lao động của Quốc hội nước Cộng hòa Xã hội Chủ nghĩa
              Việt Nam số 45/2019/QH14 ngày 20/11/2019;
            </em>
          </p>
          <p>
            <em>- Căn cứ nhu cầu và khả năng của hai Bên.</em>
          </p>
          <p>
            Hôm nay, tại Văn phòng Công ty {data.partyA.companyName} chúng tôi
            gồm có:
          </p>
        </div>

        {/* Party Info */}
        <div className="pdf-parties">
          <div className="pdf-party">
            <p className="pdf-party-title">BÊN A: {data.partyA.companyName}</p>
            <div className="pdf-party-details">
              <InfoRow label="Địa chỉ" value={data.partyA.address} />
              <div className="pdf-info-row">
                <p className="pdf-info-label">Đại diện bởi</p>
                <p className="pdf-info-separator">:</p>
                <p className="pdf-info-value" style={{ width: "50%" }}>
                  {data.partyA.representative}
                </p>
                <p
                  className="pdf-info-label"
                  style={{ width: "6rem", marginLeft: "1rem" }}
                >
                  Chức vụ:
                </p>
                <p>{data.partyA.position}</p>
              </div>
            </div>
          </div>
          <div className="pdf-party">
            <p className="pdf-party-title">BÊN B: {data.partyB.name}</p>
            <div className="pdf-party-details">
              <div className="pdf-info-row">
                <p className="pdf-info-label">Sinh ngày</p>
                <p className="pdf-info-separator">:</p>
                <p className="pdf-info-value" style={{ width: "50%" }}>
                  {dayjs(data.partyB.dob).format("DD/MM/YYYY")}
                </p>
                <p
                  className="pdf-info-label"
                  style={{ width: "6rem", marginLeft: "1rem" }}
                >
                  Quốc tịch:
                </p>
                <p>{data.partyB.nationality}</p>
              </div>
              <InfoRow label="Địa chỉ thường trú" value={data.partyB.address} />
              <div className="pdf-info-row">
                <p className="pdf-info-label">Số CCCD</p>
                <p className="pdf-info-separator">:</p>
                <p className="pdf-info-value" style={{ width: "50%" }}>
                  {data.partyB.idNumber}
                </p>
                <p
                  className="pdf-info-label"
                  style={{ width: "6rem", marginLeft: "1rem" }}
                >
                  Cấp ngày:
                </p>
                <p>
                  {new Date(data.partyB.idIssueDate).toLocaleDateString(
                    "en-GB"
                  )}
                </p>
              </div>
              <InfoRow label="Tại" value={data.partyB.idIssuePlace} />
            </div>
          </div>
        </div>

        <p className="pdf-agreement">
          Hai bên đã thỏa thuận và thống nhất các điều khoản của hợp đồng sau
          đây:
        </p>

        <div
          className="pdf-content"
          dangerouslySetInnerHTML={{ __html: markdown || "" }}
        />

        {/* Signature Block */}
        <div className="pdf-signatures">
          <div className="pdf-signature-block">
            <p className="pdf-signature-title">BÊN A</p>
            <p
              className="pdf-signature-note"
              style={{ marginBottom: `${signatures.partyA ? "0rem" : "4rem"}` }}
            >
              (Ký, đóng dấu và ghi rõ họ tên)
            </p>
            {signatures.partyA && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={signatures.partyA}
                alt="Party A signature"
                width={200}
                height={64}
                className="pdf-signature-image"
                style={{ width: "200px", height: "64px", objectFit: "contain" }}
              />
            )}
            <p className="pdf-signature-name">{data.partyA.representative}</p>
          </div>
          <div className="pdf-signature-block">
            <p className="pdf-signature-title">BÊN B</p>
            <p
              className="pdf-signature-note"
              style={{ marginBottom: `${signatures.partyB ? "0rem" : "4rem"}` }}
            >
              (Ký và ghi rõ họ tên)
            </p>
            {signatures.partyB && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={signatures.partyB}
                alt="Party B signature"
                width={200}
                height={64}
                className="pdf-signature-image"
                style={{ width: "200px", height: "64px", objectFit: "contain" }}
              />
            )}
            <p className="pdf-signature-name">{data.partyB.name}</p>
          </div>
        </div>
      </div>
    );
  }
);

PdfPreview.displayName = "PdfPreview";
