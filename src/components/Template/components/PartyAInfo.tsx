"use client";

import React from "react";
import { PartyA } from "../types";

interface PartyAInfoProps {
  data: PartyA;
}

const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="form-group">
    <label>{label}</label>
    <input value={value} readOnly />
  </div>
);

export const PartyAInfo: React.FC<PartyAInfoProps> = ({ data }) => {
  return (
    <div className="party-info">
      <h3>Party A Information (Company)</h3>
      <div className="info-grid">
        <InfoRow label="Company Name" value={data.companyName} />
        <InfoRow label="Reference Number" value={data.refNumber} />
        <InfoRow label="Address" value={data.address} />
        <InfoRow label="Representative" value={data.representative} />
        <InfoRow label="Position" value={data.position} />
      </div>
    </div>
  );
};
