"use client";

import React from "react";
import { PartyB } from "../types";

interface PartyBFormProps {
  data: PartyB;
  onChange: (changedValues: Partial<PartyB>) => void;
}

export const PartyBForm: React.FC<PartyBFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof PartyB, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="party-form">
      <h3>Party B Information (Apprentice)</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name</label>
          <input
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
