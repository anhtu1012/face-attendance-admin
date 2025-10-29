export interface PartyA {
  companyName: string;
  address: string;
  representative: string;
  position: string;
  refNumber: string;
}

export interface PartyB {
  name: string;
  nationality: string;
  dob: string;
  address: string;
  idNumber: string;
  idIssueDate: string;
  idIssuePlace: string;
}

export interface ContractData {
  title?: string;
  city?: string;
  effectiveDate?: string;
  partyA: PartyA;
  partyB: PartyB;
}

export interface Signatures {
  partyA: string | null;
  partyB: string | null;
}
